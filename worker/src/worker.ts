/**
 * Cloudflare Worker - Clash Dev Analyser (Public Backend)
 * Public repo version: all secrets must be injected through Worker env vars.
 */

import {
  DependencyQuery,
  ExternalAnalysisSignals,
  ExternalDependencySignal,
  ExternalRepoSignal,
  FileSignal,
  RepoLanguageStats,
  TreeItem,
  buildAdvancedAnalysis,
  buildDeepAnalysisReport,
  buildLanguageProfile,
  calculateDevIQ,
  collectDependencyQueries,
  selectEvidencePaths,
  targetFilesForMode,
} from "./analysisCore";

export interface Env {
  GITHUB_PAT: string;
  GROQ_API_KEY?: string;
  LANGUAGE_REPO_LIMIT?: string;
}

const MAX_FILE_BYTES = 85_000;
const PROFILE_REPO_PAGE_SIZE = 100;
const PROFILE_GRAPHQL_PAGE_LIMIT = 1;
const PROFILE_EVIDENCE_REPO_LIMIT = 3;
const CLOUDFLARE_SAFE_FETCH_BUDGET = 200;
const PROFILE_EVIDENCE_FILES_PER_REPO = 6;
const BATTLE_EVIDENCE_FILES_PER_REPO = 4;
const REPO_EVIDENCE_FILE_LIMIT = 20;
const COMPACT_REPO_EVIDENCE_FILE_LIMIT = 5;
const DEPS_DEV_FETCH_LIMIT = 4;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface FetchBudget {
  used: number;
  limit: number;
}

function createFetchBudget(): FetchBudget {
  return { used: 0, limit: CLOUDFLARE_SAFE_FETCH_BUDGET };
}

function remainingFetches(budget: FetchBudget) {
  return Math.max(0, budget.limit - budget.used);
}

async function budgetedFetch(budget: FetchBudget, input: RequestInfo | URL, init?: RequestInit, optional = false): Promise<Response | null> {
  if (remainingFetches(budget) <= 0) {
    if (optional) return null;
    throw new Error("Analysis reached the Cloudflare subrequest safety limit. Try a narrower request.");
  }
  budget.used += 1;
  return fetch(input, init);
}

async function fetchGithubAPI(endpoint: string, env: Env, budget: FetchBudget) {
  if (!env.GITHUB_PAT) throw new Error("GITHUB_PAT environment variable is not set.");
  const url = endpoint.startsWith("http") ? endpoint : `https://api.github.com${endpoint}`;
  const response = await budgetedFetch(budget, url, {
    headers: {
      Authorization: `token ${env.GITHUB_PAT}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Clash-Dev-Analyser-Worker",
    },
  });
  if (!response) return null;

  if (response.status === 403) throw new Error("GitHub API rate limit exceeded or forbidden.");
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }

  return response.json();
}

async function fetchGithubGraphQL<T>(query: string, variables: Record<string, unknown>, env: Env, budget: FetchBudget): Promise<T | null> {
  if (!env.GITHUB_PAT) throw new Error("GITHUB_PAT environment variable is not set.");
  const response = await budgetedFetch(budget, "https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_PAT}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "Clash-Dev-Analyser-Worker",
    },
    body: JSON.stringify({ query, variables }),
  }, true);
  if (!response) return null;
  if (!response.ok) return null;
  const payload = await response.json() as { data?: T; errors?: unknown };
  return payload.data || null;
}

async function fetchRawFile(rawUrl: string, env: Env, budget: FetchBudget): Promise<string | null> {
  const response = await budgetedFetch(budget, rawUrl, {
    headers: {
      Authorization: `token ${env.GITHUB_PAT}`,
      "User-Agent": "Clash-Dev-Analyser-Worker",
    },
  }, true);
  if (!response) return null;
  if (!response.ok) return null;
  const text = await response.text();
  if (text.includes("\u0000")) return null;
  return text.length > MAX_FILE_BYTES ? text.slice(0, MAX_FILE_BYTES) : text;
}



interface GithubGraphqlRepo {
  name: string;
  nameWithOwner: string;
  defaultBranchRef?: { name?: string } | null;
  stargazerCount?: number;
  forkCount?: number;
  createdAt?: string;
  updatedAt?: string;
  pushedAt?: string;
  isArchived?: boolean;
  isFork?: boolean;
  description?: string | null;
  licenseInfo?: { spdxId?: string } | null;
  issues?: { totalCount?: number };
  languages?: { edges?: Array<{ size?: number; node?: { name?: string } }> };
  repositoryTopics?: { nodes?: Array<{ topic?: { name?: string } }> };
}

interface GithubGraphqlProfile {
  user?: {
    login: string;
    name?: string | null;
    bio?: string | null;
    company?: string | null;
    location?: string | null;
    websiteUrl?: string | null;
    twitterUsername?: string | null;
    isHireable?: boolean;
    createdAt?: string;
    status?: { message?: string | null; emoji?: string | null } | null;
    pinnedItems?: { totalCount?: number };
    organizations?: { totalCount?: number };
    gists?: { totalCount?: number };
    followers?: { totalCount?: number };
    contributionsCollection?: {
      totalCommitContributions?: number;
      totalPullRequestContributions?: number;
      restrictedContributionsCount?: number;
      contributionCalendar?: {
        totalContributions?: number;
      };
    };
    repositories?: {
      totalCount?: number;
      pageInfo?: {
        hasNextPage?: boolean;
        endCursor?: string | null;
      };
      nodes?: GithubGraphqlRepo[];
    };
  } | null;
}

const PROFILE_QUERY = `
query DevAnalyzerProfile($login: String!, $repoCount: Int!, $cursor: String) {
  user(login: $login) {
    login
    name
    bio
    company
    location
    websiteUrl
    twitterUsername
    isHireable
    createdAt
    status { message emoji }
    pinnedItems(first: 6) { totalCount }
    organizations { totalCount }
    gists { totalCount }
    followers { totalCount }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
      }
    }
    repositories(first: $repoCount, after: $cursor, orderBy: { field: UPDATED_AT, direction: DESC }, privacy: PUBLIC, isFork: false) {
      totalCount
      pageInfo { hasNextPage endCursor }
      nodes {
        name
        nameWithOwner
        description
        stargazerCount
        forkCount
        createdAt
        updatedAt
        pushedAt
        isArchived
        isFork
        defaultBranchRef { name }
        licenseInfo { spdxId }
        issues(states: OPEN) { totalCount }
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name } }
        }
        repositoryTopics(first: 10) { nodes { topic { name } } }
      }
    }
  }
}`;

function repoFromGraphql(repo: GithubGraphqlRepo) {
  return {
    name: repo.name,
    full_name: repo.nameWithOwner,
    default_branch: repo.defaultBranchRef?.name || "main",
    stargazers_count: repo.stargazerCount || 0,
    forks_count: repo.forkCount || 0,
    license: repo.licenseInfo ? { spdx_id: repo.licenseInfo.spdxId || "UNKNOWN" } : null,
    created_at: repo.createdAt,
    updated_at: repo.updatedAt || repo.pushedAt,
    pushed_at: repo.pushedAt,
    open_issues_count: repo.issues?.totalCount || 0,
    archived: repo.isArchived,
    fork: repo.isFork,
    description: repo.description,
    topics: repo.repositoryTopics?.nodes?.map((node) => node.topic?.name).filter(Boolean) || [],
  };
}

function languagesFromGraphql(repo: GithubGraphqlRepo): RepoLanguageStats {
  const stats: RepoLanguageStats = {};
  for (const edge of repo.languages?.edges || []) {
    const name = edge.node?.name;
    if (name && edge.size) stats[name] = (stats[name] || 0) + edge.size;
  }
  return stats;
}

async function fetchUserGraphql(username: string, env: Env, budget: FetchBudget) {
  let cursor: string | null = null;
  let followers = 0;
  let totalRepos = 0;
  const allRepoNodes: GithubGraphqlRepo[] = [];
  let pagesFetched = 0;
  let contributions: any = null;
  let profileDetails: any = null;

  do {
    pagesFetched += 1;
    const data: GithubGraphqlProfile | null = await fetchGithubGraphQL<GithubGraphqlProfile>(
      PROFILE_QUERY,
      { login: username, repoCount: PROFILE_REPO_PAGE_SIZE, cursor },
      env,
      budget,
    ).catch(() => null);
    const user: GithubGraphqlProfile["user"] = data?.user;
    
    if (user?.contributionsCollection) {
      contributions = {
        totalCommits: user.contributionsCollection.totalCommitContributions || 0,
        totalPRs: user.contributionsCollection.totalPullRequestContributions || 0,
        restrictedCommits: user.contributionsCollection.restrictedContributionsCount || 0,
        calendarTotal: user.contributionsCollection.contributionCalendar?.totalContributions || 0,
      };
    }

    if (user) {
      profileDetails = {
        name: user.name || null,
        bio: user.bio || null,
        company: user.company || null,
        location: user.location || null,
        websiteUrl: user.websiteUrl || null,
        twitterUsername: user.twitterUsername || null,
        isHireable: user.isHireable || false,
        createdAt: user.createdAt || null,
        status: user.status ? { message: user.status.message, emoji: user.status.emoji } : null,
        pinnedItemsCount: user.pinnedItems?.totalCount || 0,
        organizationsCount: user.organizations?.totalCount || 0,
        gistsCount: user.gists?.totalCount || 0,
      };
    }

    if (!user?.repositories?.nodes) return allRepoNodes.length > 0 ? {
      followers,
      totalRepos: totalRepos || allRepoNodes.length,
      repos: allRepoNodes.map(repoFromGraphql),
      languagesArray: allRepoNodes.map(languagesFromGraphql).filter((stats) => Object.keys(stats).length > 0),
      contributions,
      profileDetails,
    } : null;

    followers = user.followers?.totalCount || followers;
    totalRepos = user.repositories.totalCount || totalRepos;
    allRepoNodes.push(...user.repositories.nodes);
    const pageInfo: { hasNextPage?: boolean; endCursor?: string | null } | undefined = user.repositories.pageInfo;
    cursor = pageInfo?.hasNextPage ? (pageInfo.endCursor || null) : null;
  } while (cursor && pagesFetched < PROFILE_GRAPHQL_PAGE_LIMIT && remainingFetches(budget) > 0);

  const repos = allRepoNodes.map(repoFromGraphql);
  const languagesArray = allRepoNodes.map(languagesFromGraphql).filter((stats) => Object.keys(stats).length > 0);
  return {
    followers,
    totalRepos: totalRepos || repos.length,
    repos,
    languagesArray,
    contributions,
    profileDetails,
  };
}

async function fetchRepoTree(owner: string, repoName: string, defaultBranch: string, env: Env, budget: FetchBudget): Promise<TreeItem[]> {
  const tree = await fetchGithubAPI(`/repos/${owner}/${repoName}/git/trees/${encodeURIComponent(defaultBranch)}?recursive=1`, env, budget).catch(() => null);
  const items = (tree as { tree?: TreeItem[] } | null)?.tree;
  return Array.isArray(items) ? items : [];
}

async function fetchRepoEvidence(owner: string, repoName: string, defaultBranch: string, env: Env, budget: FetchBudget, compact = false, maxFiles = compact ? COMPACT_REPO_EVIDENCE_FILE_LIMIT : REPO_EVIDENCE_FILE_LIMIT): Promise<FileSignal[]> {
  if (remainingFetches(budget) <= 1) return [];
  const treeItems = await fetchRepoTree(owner, repoName, defaultBranch, env, budget);
  const rawPaths = treeItems.length > 0 ? selectEvidencePaths(treeItems, compact) : targetFilesForMode(compact);
  const paths = rawPaths.slice(0, Math.min(maxFiles, remainingFetches(budget)));
  const filePromises = paths.map(async (filePath) => {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/${defaultBranch}/${filePath}`;
    const content = await fetchRawFile(rawUrl, env, budget);
    return content ? { name: filePath, content } : null;
  });
  const results = await Promise.all(filePromises);
  return results.filter((result): result is FileSignal => Boolean(result));
}

function osvSeverity(vuln: any): "critical" | "high" | "medium" | "low" {
  const text = `${vuln?.database_specific?.severity || ""} ${vuln?.severity?.map((item: any) => `${item.type}:${item.score}`).join(" ") || ""}`.toLowerCase();
  const cvss = text.match(/(\d+(?:\.\d+)?)/g)?.map(Number).sort((a, b) => b - a)[0] || 0;
  if (text.includes("critical") || cvss >= 9) return "critical";
  if (text.includes("high") || cvss >= 7) return "high";
  if (text.includes("medium") || cvss >= 4) return "medium";
  return "low";
}

async function fetchOsvSignals(queries: DependencyQuery[], budget: FetchBudget): Promise<ExternalDependencySignal[]> {
  const versioned = queries.filter((query) => query.version).slice(0, 80);
  if (versioned.length === 0) return [];
  try {
    const response = await budgetedFetch(budget, "https://api.osv.dev/v1/querybatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queries: versioned.map((query) => ({
          package: { ecosystem: query.ecosystem, name: query.packageName },
          version: query.version,
        })),
      }),
    }, true);
    if (!response) return [];
    if (!response.ok) return [];
    const payload = await response.json() as { results?: Array<{ vulns?: any[] }> };
    const signals: ExternalDependencySignal[] = [];
    payload.results?.forEach((result, index) => {
      const query = versioned[index];
      for (const vuln of result.vulns || []) {
        if (signals.length >= 60) return;
        signals.push({
          ecosystem: query.ecosystem,
          packageName: query.packageName,
          version: query.version,
          vulnerabilityId: vuln.id,
          title: `OSV vulnerability: ${vuln.id || query.packageName}`,
          detail: `${query.packageName}@${query.version} is affected by ${vuln.id || "a known vulnerability"}${vuln.summary ? `: ${vuln.summary}` : ""}.`,
          severity: osvSeverity(vuln),
          source: "osv",
          recommendation: "Upgrade to a non-vulnerable version reported by OSV or remove the dependency.",
        });
      }
    });
    return signals;
  } catch {
    return [];
  }
}

function depsDevSystem(ecosystem: string) {
  const normalized = ecosystem.toLowerCase();
  if (normalized === "npm") return "npm";
  if (normalized === "pypi") return "pypi";
  if (normalized === "crates.io") return "cargo";
  if (normalized === "go") return "go";
  return null;
}

async function fetchDepsDevSignals(queries: DependencyQuery[], budget: FetchBudget): Promise<ExternalDependencySignal[]> {
  const candidates = queries
    .filter((query) => query.version && depsDevSystem(query.ecosystem))
    .slice(0, Math.min(DEPS_DEV_FETCH_LIMIT, remainingFetches(budget)));
  const signals: ExternalDependencySignal[] = [];
  await Promise.all(candidates.map(async (query) => {
    const system = depsDevSystem(query.ecosystem);
    if (!system || !query.version) return;
    try {
      const url = `https://api.deps.dev/v3/systems/${encodeURIComponent(system)}/packages/${encodeURIComponent(query.packageName)}/versions/${encodeURIComponent(query.version)}`;
      const response = await budgetedFetch(budget, url, { headers: { Accept: "application/json" } }, true);
      if (!response) return;
      if (!response.ok) return;
      const payload = await response.json() as { isDefault?: boolean; licenses?: string[]; advisoryKeys?: unknown[]; links?: Record<string, string> };
      if (payload.advisoryKeys && payload.advisoryKeys.length > 0) {
        signals.push({
          ecosystem: query.ecosystem,
          packageName: query.packageName,
          version: query.version,
          title: "deps.dev advisory signal",
          detail: `${query.packageName}@${query.version} has ${payload.advisoryKeys.length} advisory key(s) in deps.dev metadata.`,
          severity: "medium",
          source: "deps.dev",
          recommendation: "Review deps.dev advisory metadata and upgrade if an affected range applies.",
        });
      }
      if (payload.licenses && payload.licenses.some((license) => /gpl|agpl/i.test(license))) {
        signals.push({
          ecosystem: query.ecosystem,
          packageName: query.packageName,
          version: query.version,
          title: "Restrictive license signal",
          detail: `${query.packageName}@${query.version} reports license(s): ${payload.licenses.join(", ")}.`,
          severity: "low",
          source: "deps.dev",
          recommendation: "Confirm license compatibility for your distribution model.",
        });
      }
    } catch {
      // deps.dev enrichment is best effort.
    }
  }));
  return signals.slice(0, 30);
}

async function fetchScorecardSignals(owner: string, repoName: string, budget: FetchBudget): Promise<ExternalRepoSignal[]> {
  try {
    const response = await budgetedFetch(budget, `https://api.securityscorecards.dev/projects/github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}`, {
      headers: { Accept: "application/json" },
    }, true);
    if (!response) return [];
    if (!response.ok) return [];
    const payload = await response.json() as { score?: number; checks?: Array<{ name?: string; score?: number; reason?: string }> };
    const signals: ExternalRepoSignal[] = [];
    if (typeof payload.score === "number" && payload.score < 5) {
      signals.push({
        source: "scorecard",
        title: "Low OpenSSF Scorecard score",
        detail: `${owner}/${repoName} has OpenSSF Scorecard ${payload.score}/10.`,
        severity: payload.score < 3 ? "high" : "medium",
        score: payload.score,
        recommendation: "Improve branch protection, dependency update automation, token permissions, pinned actions, and security policy coverage.",
      });
    }
    for (const check of (payload.checks || []).filter((item) => typeof item.score === "number" && item.score < 4).slice(0, 5)) {
      signals.push({
        source: "scorecard",
        title: `OpenSSF weak check: ${check.name || "unknown"}`,
        detail: check.reason || `${check.name || "A Scorecard check"} scored ${check.score}/10.`,
        severity: (check.score || 0) < 2 ? "high" : "medium",
        score: check.score,
        recommendation: "Review the failing OpenSSF Scorecard check and apply the project-specific remediation.",
      });
    }
    return signals;
  } catch {
    return [];
  }
}

async function buildExternalSignals(owner: string, repoNames: string[], files: FileSignal[], budget: FetchBudget): Promise<ExternalAnalysisSignals> {
  const dependencyQueries = collectDependencyQueries(files);
  const osvSignals = await fetchOsvSignals(dependencyQueries, budget);
  const depsDevSignals = await fetchDepsDevSignals(dependencyQueries, budget);
  const scorecardRepos = repoNames.slice(0, Math.min(3, remainingFetches(budget)));
  const scorecardResults = await Promise.all(scorecardRepos.map((repoName) => fetchScorecardSignals(owner, repoName, budget)));
  const repoSignals = scorecardResults.flat();
  const sources = [
    "GitHub GraphQL",
    dependencyQueries.length > 0 && osvSignals.length > 0 ? "OSV.dev" : "",
    dependencyQueries.length > 0 && depsDevSignals.length > 0 ? "deps.dev" : "",
    repoSignals.length > 0 ? "OpenSSF Scorecard" : "",
  ].filter(Boolean);

  return {
    dependencySignals: [...osvSignals, ...depsDevSignals],
    repoSignals,
    dependencyQueries,
    sources,
  };
}

async function processUser(username: string, env: Env, budget: FetchBudget, battleMode = false) {
  const graphqlProfile = await fetchUserGraphql(username, env, budget);
  let repos: any[] = graphqlProfile?.repos || [];
  let languagesArray = graphqlProfile?.languagesArray || [];
  let followers = graphqlProfile?.followers || 0;
  let analyzedReposCount = graphqlProfile?.totalRepos || repos.length;

  if (!graphqlProfile) {
    const [userProfile, reposResponse] = await Promise.all([
      fetchGithubAPI(`/users/${username}`, env, budget).catch(() => null),
      fetchGithubAPI(`/users/${username}/repos?per_page=100&sort=updated`, env, budget),
    ]);
    repos = (reposResponse as any[]) || [];
    if (!Array.isArray(repos)) repos = [];
    repos.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
    const languageLimit = battleMode
      ? 5
      : Math.max(1, Math.min(Number(env.LANGUAGE_REPO_LIMIT || "15") || 15, 15));
    const languageRepos = repos.slice(0, languageLimit);
    languagesArray = [];
    for (const repo of languageRepos) {
      const lang = await fetchGithubAPI(repo.languages_url, env, budget);
      if (lang) languagesArray.push(lang as RepoLanguageStats);
    }
    followers = (userProfile as any)?.followers || 0;
    analyzedReposCount = repos.length;
  }

  repos.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
  const topRepos = repos.slice(0, battleMode ? 2 : PROFILE_EVIDENCE_REPO_LIMIT);
  const devIq = calculateDevIQ(repos, languagesArray, followers);
  const languageProfile = buildLanguageProfile(languagesArray);
  const languageTags = languageProfile.languageTags.map((tag) => `${tag} Dev`);
  let repoFiles: FileSignal[] = [];

  for (const repo of topRepos) {
    const defaultBranch = repo.default_branch || "main";
    const maxFiles = battleMode ? BATTLE_EVIDENCE_FILES_PER_REPO : PROFILE_EVIDENCE_FILES_PER_REPO;
    const evidence = await fetchRepoEvidence(username, repo.name, defaultBranch, env, budget, true, maxFiles);
    repoFiles = [
      ...repoFiles,
      ...evidence.map((file) => ({ ...file, name: `${repo.name}/${file.name}` })),
    ];
  }
  const externalSignals = await buildExternalSignals(username, topRepos.map((repo) => repo.name), repoFiles, budget);

  const advancedAnalysis = buildAdvancedAnalysis({
    kind: "dev",
    devIq,
    repoCount: analyzedReposCount,
    languages: languageProfile.languages,
    files: repoFiles,
    externalSignals,
  });
  const maturityAnalysis = buildDeepAnalysisReport(repoFiles, advancedAnalysis.metrics, advancedAnalysis.primaryTrack, advancedAnalysis);
  advancedAnalysis.deepAnalysis = maturityAnalysis;

  const localResult = {
    username,
    devIq,
    languageTags,
    maturityAnalysis,
    analyzedReposCount,
    advancedAnalysis,
    repos: repos.slice(0, 15).map((r: any) => ({ name: r.name, stars: r.stargazers_count || 0, forks: r.forks_count || 0, description: r.description || '' })),
    followers,
    contributions: graphqlProfile?.contributions || null,
    profileDetails: graphqlProfile?.profileDetails || null,
  };

  let aiResult: any = {};
  try {
    aiResult = await getAIAnalysis(localResult, env, budget);
  } catch { /* AI failure must never break analysis */ }

  return { ...localResult, ...aiResult };
}

async function processRepo(owner: string, repoName: string, env: Env, budget: FetchBudget, compact = false) {
  const repo: any = await fetchGithubAPI(`/repos/${owner}/${repoName}`, env, budget);
  if (!repo) throw new Error(`Repo ${owner}/${repoName} not found`);

  const languages = await fetchGithubAPI(repo.languages_url, env, budget);
  const devIq = calculateDevIQ([repo], languages ? [languages as RepoLanguageStats] : []);
  const languageProfile = buildLanguageProfile(languages ? [languages as RepoLanguageStats] : []);
  const defaultBranch = repo.default_branch || "main";
  const maxFiles = compact ? COMPACT_REPO_EVIDENCE_FILE_LIMIT : REPO_EVIDENCE_FILE_LIMIT;
  const repoFiles = await fetchRepoEvidence(owner, repoName, defaultBranch, env, budget, compact, maxFiles);
  const externalSignals = await buildExternalSignals(owner, [repoName], repoFiles, budget);

  const advancedAnalysis = buildAdvancedAnalysis({
    kind: "repo",
    devIq,
    repoCount: 1,
    languages: languageProfile.languages,
    files: repoFiles,
    externalSignals,
  });
  const maturityAnalysis = buildDeepAnalysisReport(repoFiles, advancedAnalysis.metrics, advancedAnalysis.primaryTrack, advancedAnalysis);
  advancedAnalysis.deepAnalysis = maturityAnalysis;

  const localResult = {
    owner,
    repoName,
    devIq,
    languageTags: languageProfile.languageTags,
    maturityAnalysis,
    advancedAnalysis,
    repoMeta: { stars: (repo as any).stargazers_count || 0, forks: (repo as any).forks_count || 0, watchers: (repo as any).watchers_count || 0, open_issues: (repo as any).open_issues_count || 0, description: (repo as any).description || '' },
  };

  let aiResult: any = {};
  try {
    aiResult = await getAIAnalysis(localResult, env, budget);
  } catch { /* AI failure must never break analysis */ }

  return { ...localResult, ...aiResult };
}



function responseHeaders(origin: string | null) {
  return {
    ...CORS_HEADERS,
    "Access-Control-Allow-Origin": origin || "*",
    "Content-Type": "application/json",
  };
}

// ── Deterministic Analysis Engine (Groq) ─────────────────────────────────────
function buildAIPayload(payload: any): any {
  // Trim to essential data only - advancedAnalysis is too large for Groq context
  const trimmed: any = {};
  if (payload.username) trimmed.username = payload.username;
  if (payload.owner) trimmed.owner = payload.owner;
  if (payload.repoName) trimmed.repoName = payload.repoName;
  trimmed.devIq = payload.devIq;
  trimmed.languageTags = payload.languageTags;
  trimmed.analyzedReposCount = payload.analyzedReposCount;
  trimmed.followers = payload.followers;
  if (payload.repos) trimmed.repos = payload.repos;
  if (payload.repoMeta) trimmed.repoMeta = payload.repoMeta;
  // Include key metrics from advancedAnalysis without the huge blob
  if (payload.advancedAnalysis) {
    trimmed.metrics = payload.advancedAnalysis.metrics;
    trimmed.algorithmicScore = payload.advancedAnalysis.algorithmicScore;
    trimmed.primaryTrack = { name: payload.advancedAnalysis.primaryTrack?.name, score: payload.advancedAnalysis.primaryTrack?.score };
    trimmed.securityScore = payload.advancedAnalysis.securityScore;
    trimmed.confidence = payload.advancedAnalysis.confidence;
    if (payload.advancedAnalysis.severityCounts) trimmed.severityCounts = payload.advancedAnalysis.severityCounts;
    if (payload.advancedAnalysis.languageDistribution) trimmed.languages = payload.advancedAnalysis.languageDistribution.slice(0, 8).map((l: any) => `${l.name}:${l.pct}%`);
  }
  if (payload.contributions) {
    trimmed.contributions = payload.contributions;
  }
  if (payload.profileDetails) {
    trimmed.profileDetails = payload.profileDetails;
  }
  if (payload.maturityAnalysis) {
    trimmed.maturitySummary = payload.maturityAnalysis.summary?.slice(0, 300);
  }
  return trimmed;
}

async function getAIAnalysis(payload: any, env: Env, _budget: FetchBudget): Promise<any> {
  const apiKey = env.GROQ_API_KEY;
  if (!apiKey) return {};

  const trimmed = buildAIPayload(payload);

  const systemPrompt = `You are a STRICT but highly flexible senior staff engineer reviewing GitHub profiles. You judge like a hiring manager at FAANG. Return ONLY valid JSON, no markdown.
Schema:
{
  "ai_score": <0-100. Dynamically calculate this using the comprehensive grading system below.>,
  "ai_grade": <"S"|"A+"|"A"|"B+"|"B"|"C"|"D"|"F". Match the calculated score: S (95+), A+/A (85-94), B+/B (70-84), C (50-69), D (30-49), F (<30)>,
  "profile_verdict": <30 words, blunt overall assessment>,
  "code_quality_verdict": <30 words>,
  "architecture_verdict": <30 words>,
  "security_verdict": <30 words>,
  "scalability_verdict": <30 words>,
  "documentation_verdict": <30 words>,
  "innovation_verdict": <30 words>,
  "community_verdict": <30 words, about stars/forks/followers/visibility>,
  "role_fit_verdict": <30 words, best role and why>,
  "growth_verdict": <30 words, what they should improve>,
  "roast": <80-120 words. SAVAGE funny roast. Roast username, repo names, star count, fork count, language choices, commit patterns. Be cringey, use gen-z humor, emojis. Reference specific repos/stats.>,
  "top_repos_analysis": [{"repo_name": <string>, "repo_score": <0-100>, "verdict": <25 words>}]
}

COMPREHENSIVE GRADING SYSTEM:
Evaluate the developer dynamically based on these exact dimensions, maintaining a flexible yet strict perspective:

1. Commit Regularity & Sincerity (20% Weight):
   - Check contribution totals and calendar details.
   - Regular daily/weekly commits indicate great dedication and sincerity. High regularity = major score boost.
   - Abandoned or highly sporadic commit histories penalty.

2. Code volume, Scanned Data & Quality (15% Weight):
   - Number of repositories, file structure, tests, and CI configuration.
   - Total scanned data bytes (amount of scanned codebase data).
   - Active testing (Jest, PyTest, etc.) and codebase maintainability boost this score.

3. Open Source Impact, Achievements & Affiliations (15% Weight):
   - Followers, stars, forks, and repository engagement.
   - Organization memberships (organizationsCount) and active Gists (gistsCount).

4. Profile Decoration & Completeness (10% Weight):
   - Profile completeness: presence of bio, location, company, website, and Twitter username.
   - Pinned repositories/projects count (pinnedItemsCount) indicating customization and visual presentation.
   - Presence of custom status messages and profile emojis. High profile polish = score boost.

5. Language-Specific Complexity Scale (15% Weight):
   - Rate technological depth based on language choices:
     * HTML / CSS / Presentation only: Low score weighting.
     * JavaScript / PHP / Basic scripting: Medium/normal weighting (solid baseline).
     * Python / Go / Ruby / Core Backends: Normal/strong weighting.
     * TypeScript / Rust / Zig / C++ / C / Assembly / Solidity: High/expert weighting (major boost for type rigor and low-level complexity).

6. Versatility & Number of Languages Known (10% Weight):
   - Broad polyglot skills, well-distributed languages, and number of active programming languages used.

7. Documentation Rigor (10% Weight):
   - Presence of comprehensive READMEs, setup guides, LICENSEs, and SECURITY policies.

8. Collaboration & PR History (5% Weight):
   - Count of Pull Requests and active public organization work.

CRITICAL RULES:
- **LEGEND OVERRIDE**: If a profile is an industry legend or open-source pioneer (e.g. Torvalds, tj, yyx990803) with huge followers (>1,000) or stars (>2,000), grade them **S** or **A+** (Score 92-100) automatically, disregarding low GitHub-specific direct commit calendars.
- **IMPOSTER PENALTY**: Standard developers with high stars/forks but extremely low active commit count (<20 commits) are template copy-pasters; cap them at a max score of 50 (Grade C or D).
- Be incredibly strict but completely fair, rewarding true software engineering discipline, regularity, profile presentation, and technical depth.`;

  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it"];

  for (const model of models) {
    try {
      console.log(`[GROQ API] Attempting analysis using model: ${model}`);
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: JSON.stringify(trimmed) },
          ],
          temperature: 0.9,
          max_completion_tokens: 1500,
          top_p: 1,
          stream: false,
        }),
      });

      if (resp.ok) {
        const data = await resp.json() as any;
        try {
          const content = data.choices?.[0]?.message?.content ?? "{}";
          const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const parsed = JSON.parse(cleaned);
          console.log(`[GROQ API SUCCESS] Generated successfully with model: ${model}`);
          return parsed;
        } catch (err: any) {
          console.error(`[GROQ JSON PARSE ERROR] Model ${model} returned unparseable content: ${err.message}`);
        }
      } else {
        const errText = await resp.text().catch(() => "No error body");
        console.warn(`[GROQ API WARN] Model ${model} failed with status ${resp.status}: ${errText}`);
      }
    } catch (err: any) {
      console.error(`[GROQ MODEL ERROR] Error during ${model} run: ${err.message}`);
    }
  }

  return {};
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          ...CORS_HEADERS,
          "Access-Control-Allow-Origin": origin || "*",
        },
      });
    }

    try {
      const budget = createFetchBudget();
      const url = new URL(request.url);

      if (url.pathname === "/api/analyze" && request.method === "POST") {
        const body = (await request.json().catch(() => ({}))) as { username?: string };
        if (!body.username) {
          return new Response(JSON.stringify({ error: "Username required" }), { status: 400, headers: responseHeaders(origin) });
        }
        const data = await processUser(body.username.trim().toLowerCase(), env, budget);
        return new Response(JSON.stringify(data), { headers: responseHeaders(origin) });
      }

      if (url.pathname === "/api/compare-devs" && request.method === "POST") {
        const body = (await request.json().catch(() => ({}))) as { dev1?: string; dev2?: string };
        if (!body.dev1 || !body.dev2) {
          return new Response(JSON.stringify({ error: "dev1 and dev2 required" }), { status: 400, headers: responseHeaders(origin) });
        }

        const dev1Data = await processUser(body.dev1.trim().toLowerCase(), env, budget, true);
        const dev2Data = await processUser(body.dev2.trim().toLowerCase(), env, budget, true);
        return new Response(JSON.stringify({ dev1: dev1Data, dev2: dev2Data }), { headers: responseHeaders(origin) });
      }

      if (url.pathname === "/api/analyze-repo" && request.method === "POST") {
        const body = (await request.json().catch(() => ({}))) as { repo?: string };
        if (!body.repo) {
          return new Response(JSON.stringify({ error: "repo required (e.g., owner/repo)" }), { status: 400, headers: responseHeaders(origin) });
        }

        const [owner, name] = body.repo.trim().split("/");
        if (!owner || !name) {
          return new Response(JSON.stringify({ error: "Invalid repo format. Use owner/repo" }), { status: 400, headers: responseHeaders(origin) });
        }

        const data = await processRepo(owner.toLowerCase(), name.toLowerCase(), env, budget);
        return new Response(JSON.stringify(data), { headers: responseHeaders(origin) });
      }

      if (url.pathname === "/api/compare-repos" && request.method === "POST") {
        const body = (await request.json().catch(() => ({}))) as { repo1?: string; repo2?: string };
        if (!body.repo1 || !body.repo2) {
          return new Response(JSON.stringify({ error: "repo1 and repo2 required (e.g., owner/repo)" }), { status: 400, headers: responseHeaders(origin) });
        }

        const [owner1, name1] = body.repo1.trim().split("/");
        const [owner2, name2] = body.repo2.trim().split("/");
        if (!owner1 || !name1 || !owner2 || !name2) {
          return new Response(JSON.stringify({ error: "Invalid repo format. Use owner/repo" }), { status: 400, headers: responseHeaders(origin) });
        }

        const [repo1Data, repo2Data] = await Promise.all([
          processRepo(owner1.toLowerCase(), name1.toLowerCase(), env, budget, true),
          processRepo(owner2.toLowerCase(), name2.toLowerCase(), env, budget, true),
        ]);
        return new Response(JSON.stringify({ repo1: repo1Data, repo2: repo2Data }), { headers: responseHeaders(origin) });
      }

      return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: responseHeaders(origin),
      });
    }
  },
};
