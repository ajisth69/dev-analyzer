import {
  AdvancedAnalysis,
  AnalysisMetrics,
  AnalyzerResponse,
  DependencyRisk,
  EvidenceSummary,
  RepoAnalysisResponse,
  SecurityFinding,
  Severity,
} from '../hooks/useDevAnalyzer';

export interface InsightItem {
  title: string;
  detail: string;
  impact?: 'High' | 'Medium' | 'Low';
}

export interface RoleFit {
  role: string;
  score: number;
  matched: string[];
  gaps: string[];
}

export interface HealthCategory {
  label: string;
  score: number;
  evidence: string;
}

export interface TimelineItem {
  label: string;
  detail: string;
  intensity: number;
}

export interface LanguageUsage {
  name: string;
  pct: number;
  color: string;
}

export interface TrackSignal {
  name: string;
  score: number;
  evidence: string[];
}

export interface LocalFeaturePack {
  name: string;
  kindLabel: string;
  algorithmicScore: number;
  algorithmicMetrics: AnalysisMetrics;
  primaryTrack: TrackSignal;
  trackSignals: TrackSignal[];
  languageDistribution: LanguageUsage[];
  roadmap: InsightItem[];
  roleFits: RoleFit[];
  codebaseHealth: {
    overall: number;
    categories: HealthCategory[];
    blockers: string[];
  };
  hireabilityReport: {
    grade: string;
    summary: string;
    strengths: string[];
    risks: string[];
    bestFitRoles: string[];
    interviewTalkingPoints: string[];
  };
  contributionFingerprint: InsightItem[];
  timeline: TimelineItem[];
  explanations: {
    recruiter: string;
    cto: string;
    peer: string;
    beginner: string;
    report: string;
  };
  deepAnalysis?: {
    summary: string;
    architecture: string;
    modernity: string;
    security: string;
    scalability: string;
    remarks: Array<{ topic: string; remark: string }>;
  };
  weaknessDetector: InsightItem[];
  securityScore: number;
  vulnerabilities: SecurityFinding[];
  dependencyRisks: DependencyRisk[];
  architectureFindings: InsightItem[];
  codeSmells: InsightItem[];
  testQuality: { score: number; evidence: string[]; gaps: string[] };
  productionReadiness: { score: number; evidence: string[]; blockers: string[] };
  confidenceBreakdown: Array<{ label: string; score: number; detail: string }>;
  severityCounts: Record<Severity, number>;
  evidenceSummary?: EvidenceSummary;
  shareCard: {
    title: string;
    subtitle: string;
    highlights: string[];
  };
}

type Target = AnalyzerResponse | RepoAnalysisResponse;

type ParsedLanguage = {
  name: string;
  pct: number;
};

const ROLE_PROFILES = [
  { role: 'Frontend Engineer', languages: ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'Vue', 'Svelte', 'Astro', 'MDX', 'React', 'Next.js'], track: 'Frontend Product' },
  { role: 'Backend Engineer', languages: ['Python', 'Go', 'Java', 'Rust', 'C#', 'Ruby', 'PHP', 'Elixir', 'Scala', 'Kotlin', 'TypeScript', 'Node.js', 'GraphQL'], track: 'Backend / API' },
  { role: 'Full Stack Engineer', languages: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Java', 'HTML', 'CSS', 'React', 'Node.js'], track: 'Full Stack Product' },
  { role: 'Systems Engineer', languages: ['C', 'C++', 'Rust', 'Zig', 'Assembly', 'Objective-C', 'Nim', 'Crystal'], track: 'Systems / Low Level' },
  { role: 'DevOps / Platform Engineer', languages: ['Shell', 'Go', 'Python', 'HCL', 'Dockerfile', 'Makefile', 'Nix', 'YAML', 'Kubernetes', 'Ansible'], track: 'DevOps / Platform' },
  { role: 'ML / Data Engineer', languages: ['Python', 'Jupyter Notebook', 'R', 'Julia', 'Scala', 'MATLAB', 'SQL'], track: 'ML / Data' },
  { role: 'Mobile Engineer', languages: ['Swift', 'Kotlin', 'Dart', 'Objective-C', 'Java', 'TypeScript'], track: 'Mobile Product' },
  { role: 'Web3 / Smart Contract Engineer', languages: ['Solidity', 'Rust', 'TypeScript', 'Go', 'Vyper'], track: 'Web3 / Crypto' },
  { role: 'Game Developer', languages: ['C++', 'C#', 'HLSL', 'GLSL', 'Lua', 'Rust'], track: 'Game Development' },
  { role: 'Security Engineer', languages: ['Python', 'C', 'Assembly', 'Rust', 'Go', 'Shell', 'Ruby'], track: 'Security / Research' }
];

const COMPLEXITY: Record<string, number> = {
  C: 96,
  'C++': 95,
  Rust: 94,
  Zig: 90,
  Assembly: 98,
  Go: 84,
  Java: 82,
  Scala: 86,
  'C#': 80,
  TypeScript: 78,
  Python: 72,
  Kotlin: 76,
  JavaScript: 66,
  Ruby: 64,
  PHP: 62,
  HTML: 36,
  CSS: 38,
  Shell: 58,
  Dockerfile: 58,
  HCL: 62,
  Makefile: 54,
  'Jupyter Notebook': 62,
  R: 66,
  Julia: 78,
  Swift: 78,
  Dart: 74,
  Solidity: 88,
  Vyper: 86,
  Lua: 60,
  SQL: 56,
  Nim: 82,
  Crystal: 80,
  Elixir: 84,
  Clojure: 88,
  Haskell: 96,
  OCaml: 92,
  Erlang: 90
};

const LANGUAGE_COLORS = ['#38bdf8', '#818cf8', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa', '#22c55e', '#eab308'];
const DISPLAY_MINOR_LANGUAGES = new Set(['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'C', 'C++', 'Java', 'C#']);

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function gradeFromScore(score: number) {
  if (score >= 88) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 58) return 'C';
  if (score >= 44) return 'D';
  return 'E';
}

function isInsightItem(item: InsightItem | null): item is InsightItem {
  return Boolean(item);
}

function getTargetName(target: Target) {
  if ('username' in target) return `@${target.username}`;
  return `${target.owner}/${target.repoName}`;
}

function parseLanguages(tags: string[]): ParsedLanguage[] {
  return tags.map((tag) => {
    const match = tag.trim().match(/^(\d+)%\s+(.+?)(?:\s+Dev)?$/);
    const language = match?.[2]?.trim() || tag.replace(/\d+%/g, '').replace(/\s+Dev$/, '').trim();
    return {
      name: language,
      pct: Number(match?.[1] || 0),
    };
  }).filter((lang) => lang.name);
}

function languagePct(languages: ParsedLanguage[], names: string[]) {
  return languages
    .filter((lang) => names.includes(lang.name))
    .reduce((sum, lang) => sum + lang.pct, 0);
}

function significantLanguages(tags: string[], minimumPct = 3) {
  const languages = parseLanguages(tags);
  const significant = languages.filter((lang) => lang.pct >= minimumPct);
  return significant.length > 0 ? significant : languages.slice(0, 1);
}

function buildLanguageDistribution(tags: string[]): LanguageUsage[] {
  const languages = parseLanguages(tags).sort((a, b) => b.pct - a.pct);
  const major = languages.filter((lang) => lang.pct >= 3 || (lang.pct > 0 && DISPLAY_MINOR_LANGUAGES.has(lang.name)));
  const minorTotal = languages
    .filter((lang) => lang.pct > 0 && !major.some((majorLang) => majorLang.name === lang.name))
    .reduce((sum, lang) => sum + lang.pct, 0);
  const distribution = major.length > 0 ? [...major] : languages.slice(0, 1);

  if (minorTotal > 0) {
    distribution.push({ name: 'Other', pct: minorTotal });
  }

  return distribution.map((lang, index) => ({
    ...lang,
    pct: clamp(lang.pct),
    color: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length],
  }));
}

function repoCountOf(target: Target) {
  return 'analyzedReposCount' in target ? target.analyzedReposCount : 1;
}

function devIqSignal(devIq: number) {
  const normalized = (Math.log10(Math.max(devIq, 100)) - 3) * 18;
  return clamp(normalized);
}

function scaleSignal(target: Target) {
  const repoCount = repoCountOf(target);
  const repoSignal = 'analyzedReposCount' in target ? Math.min(repoCount, 35) * 1.25 : 8;
  return clamp(devIqSignal(target.devIq) * 0.82 + repoSignal);
}

function complexitySignal(languages: ParsedLanguage[]) {
  if (languages.length === 0) return 40;
  const weighted = languages.reduce((sum, lang) => {
    return sum + (COMPLEXITY[lang.name] || 58) * (lang.pct / 100);
  }, 0);
  return clamp(weighted);
}

function focusSignal(languages: ParsedLanguage[]) {
  const dominant = languages[0]?.pct || 0;
  const majorCount = languages.filter((lang) => lang.pct >= 8).length;
  if (dominant >= 82) return clamp(76 + (dominant - 82) * 0.6);
  if (majorCount >= 3) return 74;
  if (majorCount === 2) return 68;
  return 58;
}

function buildTrackSignals(target: Target): TrackSignal[] {
  const languages = parseLanguages(target.languageTags);
  const frontendCore = languagePct(languages, ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'Vue', 'Svelte', 'Astro', 'MDX']);
  const browserMarkup = languagePct(languages, ['HTML', 'CSS', 'Vue', 'Svelte', 'Astro']);
  const typedJs = languagePct(languages, ['TypeScript']);
  const backendCore = languagePct(languages, ['Python', 'Go', 'Java', 'Rust', 'C#', 'Ruby', 'PHP', 'Elixir', 'Scala', 'Kotlin', 'Erlang', 'Clojure']);
  const nodeBackendAmbiguous = languagePct(languages, ['TypeScript', 'JavaScript']) * (browserMarkup >= 15 ? 0.15 : 0.35);
  const systemsCore = languagePct(languages, ['C', 'C++', 'Rust', 'Zig', 'Assembly', 'Objective-C', 'Nim', 'Crystal', 'Haskell', 'OCaml']);
  const dataCore = languagePct(languages, ['Python', 'Jupyter Notebook', 'R', 'Julia', 'Scala', 'MATLAB', 'SQL']);
  const devopsCore = languagePct(languages, ['Shell', 'Dockerfile', 'HCL', 'Makefile', 'Nix', 'YAML', 'Groovy']);
  const mobileCore = languagePct(languages, ['Swift', 'Kotlin', 'Dart', 'Objective-C']);
  const web3Core = languagePct(languages, ['Solidity', 'Vyper']) + languagePct(languages, ['Rust', 'Go', 'TypeScript']) * 0.2;
  const gameCore = languagePct(languages, ['C++', 'C#', 'Lua', 'HLSL', 'GLSL']);
  const securityCore = languagePct(languages, ['Python', 'C', 'Assembly', 'Rust', 'Go', 'Shell']) * 0.4;

  const repoBoost = Math.min(repoCountOf(target), 20) * 0.35;
  const scale = devIqSignal(target.devIq) * 0.18;

  const frontendScore = clamp(frontendCore * 0.78 + browserMarkup * 0.22 + typedJs * 0.14 + repoBoost + scale);
  const backendScore = clamp((backendCore + nodeBackendAmbiguous) * 0.86 + repoBoost + scale);
  const systemsScore = clamp(systemsCore * 0.95 + complexitySignal(languages) * 0.16 + scale);
  const dataScore = clamp(dataCore * 0.78 + languagePct(languages, ['Python']) * 0.12 + repoBoost + scale);
  const devopsScore = clamp(devopsCore * 0.9 + languagePct(languages, ['Go', 'Python']) * 0.1 + repoBoost + scale);
  const fullStackScore = clamp(Math.min(frontendScore, backendScore) * 1.18 + Math.min(frontendScore + backendScore, 150) * 0.08);
  const mobileScore = clamp(mobileCore * 0.95 + repoBoost + scale);
  const web3Score = clamp(web3Core * 0.88 + repoBoost + scale);
  const gameScore = clamp(gameCore * 0.9 + repoBoost + scale);
  const securityScore = clamp(securityCore * 0.8 + repoBoost + scale);

  const tracks: TrackSignal[] = [
    { name: 'Frontend Product', score: frontendScore, evidence: [`Frontend language signal ${clamp(frontendCore)}%`, browserMarkup > 0 ? `UI markup/style signal ${clamp(browserMarkup)}%` : 'JS/TS-only frontend evidence possible'] },
    { name: 'Backend / API', score: backendScore, evidence: [`Backend language signal ${clamp(backendCore + nodeBackendAmbiguous)}%`, 'No UI requirement applied'] },
    { name: 'Full Stack Product', score: fullStackScore, evidence: [`Frontend ${frontendScore}/100`, `Backend ${backendScore}/100`] },
    { name: 'Systems / Low Level', score: systemsScore, evidence: [`Systems language signal ${clamp(systemsCore)}%`, `Complexity ${complexitySignal(languages)}/100`] },
    { name: 'DevOps / Platform', score: devopsScore, evidence: [`Platform language signal ${clamp(devopsCore)}%`, 'Automation languages are treated as first-class work'] },
    { name: 'ML / Data', score: dataScore, evidence: [`Data language signal ${clamp(dataCore)}%`, 'Python/Jupyter/R/Julia are evaluated as data work, not backend-only work'] },
    { name: 'Mobile Product', score: mobileScore, evidence: [`Mobile language signal ${clamp(mobileCore)}%`] },
    { name: 'Web3 / Crypto', score: web3Score, evidence: [`Web3 language signal ${clamp(web3Core)}%`] },
    { name: 'Game Development', score: gameScore, evidence: [`Game dev language signal ${clamp(gameCore)}%`] },
    { name: 'Security / Research', score: securityScore, evidence: [`Security language signal ${clamp(securityCore)}%`] }
  ];

  return tracks.sort((a, b) => b.score - a.score).filter(t => t.score > 8);
}

function buildLocalMetrics(target: Target, kind: 'dev' | 'repo', tracks: TrackSignal[]): AnalysisMetrics {
  const languages = significantLanguages(target.languageTags);
  const primaryTrack = tracks[0] || { name: 'General Software', score: 45, evidence: [] };
  const scale = scaleSignal(target);
  const complexity = complexitySignal(languages);
  const focus = focusSignal(languages);
  const repoCount = repoCountOf(target);
  const breadth = clamp(48 + Math.min(languages.filter((lang) => lang.pct >= 5).length, 6) * 7 + Math.min(repoCount, 16) * 0.6);
  
  const Modernity = clamp(languagePct(languages, ['Rust', 'Go', 'TypeScript', 'Svelte', 'Astro', 'Kotlin', 'Swift', 'Zig', 'Solidity']) * 0.8 + scale * 0.2 + (target.devIq > 500_000 ? 10 : 0));
  const Architecture = clamp(complexity * 0.4 + scale * 0.3 + primaryTrack.score * 0.2 + (kind === 'repo' ? 10 : 0));

  return {
    Logic: clamp(primaryTrack.score * 0.42 + scale * 0.28 + complexity * 0.22 + focus * 0.08),
    Documentation: clamp(42 + scale * 0.24 + Math.min(repoCount, 18) * 1.2 + (kind === 'repo' ? primaryTrack.score * 0.16 : primaryTrack.score * 0.1)),
    Versatility: clamp(primaryTrack.name === 'Full Stack Product' ? breadth + 14 : breadth + Math.min(tracks[1]?.score || 0, 60) * 0.12),
    Popularity: clamp(scale + (target.devIq > 1_000_000 ? 10 : 0)),
    Architecture,
    Modernity
  };
}

function weightedLocalScore(metrics: AnalysisMetrics, primaryTrack: TrackSignal) {
  return clamp(
    metrics.Logic * 0.25 +
    metrics.Popularity * 0.20 +
    metrics.Documentation * 0.15 +
    metrics.Versatility * 0.10 +
    (metrics.Architecture || 50) * 0.15 +
    (metrics.Modernity || 50) * 0.05 +
    primaryTrack.score * 0.10
  );
}

function buildRoleFits(target: Target, metrics: AnalysisMetrics, tracks: TrackSignal[]): RoleFit[] {
  const languages = significantLanguages(target.languageTags, 2);
  const trackMap = new Map(tracks.map((track) => [track.name, track.score]));

  return ROLE_PROFILES.map((profile) => {
    const matchedLanguages = languages.filter((lang) => profile.languages.includes(lang.name));
    const languageScore = matchedLanguages.reduce((sum, lang) => sum + lang.pct, 0);
    const trackScore = trackMap.get(profile.track) || 0;
    const score = clamp(trackScore * 0.48 + languageScore * 0.24 + metrics.Logic * 0.18 + metrics.Popularity * 0.1);
    const matched = [
      `${profile.track} track ${trackScore}/100`,
      ...matchedLanguages.slice(0, 3).map((lang) => `${lang.name} ${lang.pct}%`),
      metrics.Logic >= 75 ? 'Strong implementation signal' : '',
    ].filter(Boolean);
    const gaps = [
      score < 55 ? `Build one polished ${profile.track.toLowerCase()} project` : '',
      metrics.Documentation < 65 ? 'Improve README, examples, screenshots, and setup proof' : '',
      metrics.Popularity < 45 ? 'Add demos, releases, tags, and clearer repo descriptions' : '',
    ].filter(Boolean);

    return { role: profile.role, score, matched, gaps };
  }).sort((a, b) => b.score - a.score);
}

function buildHealth(target: Target, metrics: AnalysisMetrics, tracks: TrackSignal[]) {
  const primaryTrack = tracks[0] || { name: 'General Software', score: 45, evidence: [] };
  const secondaryTrack = tracks[1] || { name: 'Secondary Track', score: 0, evidence: [] };
  const repoCount = repoCountOf(target);
  const categories: HealthCategory[] = [
    {
      label: 'Track Fit',
      score: primaryTrack.score,
      evidence: `${primaryTrack.name} detected. ${primaryTrack.evidence.join(' | ')}.`,
    },
    {
      label: 'Implementation Depth',
      score: metrics.Logic,
      evidence: `Weighted from Dev IQ, language complexity, specialization, and ${primaryTrack.name} fit.`,
    },
    {
      label: 'Presentation Signal',
      score: metrics.Documentation,
      evidence: 'Estimated from portfolio depth and public GitHub signal. No backend/UI requirement is forced here.',
    },
    {
      label: 'Domain Breadth',
      score: metrics.Versatility,
      evidence: `${secondaryTrack.name} is the next strongest lane at ${secondaryTrack.score}/100.`,
    },
    {
      label: 'External Proof',
      score: metrics.Popularity,
      evidence: `Derived from Dev IQ ${target.devIq.toLocaleString()} and visible repo count ${repoCount}.`,
    },
  ];

  const blockers = [
    primaryTrack.score < 45 ? 'The visible language mix does not clearly prove one strong engineering lane.' : '',
    metrics.Documentation < 58 ? 'Public presentation looks weaker than the code signal.' : '',
    metrics.Popularity < 40 ? 'External adoption or discoverability is still light.' : '',
    repoCount < 3 && 'analyzedReposCount' in target ? 'Profile has too few visible repositories for confident seniority scoring.' : '',
  ].filter(Boolean);

  return {
    overall: clamp(categories.reduce((sum, item) => sum + item.score, 0) / categories.length),
    categories,
    blockers,
  };
}

function buildRoadmap(metrics: AnalysisMetrics, primaryTrack: TrackSignal): InsightItem[] {
  const items: Array<InsightItem | null> = [
    primaryTrack.score < 65 ? { title: `Sharpen the ${primaryTrack.name} proof`, detail: 'Make the best repo clearly demonstrate the lane it belongs to. Do not add unrelated backend/UI just for scoring.', impact: 'High' } : null,
    metrics.Documentation < 70 ? { title: 'Make the project story undeniable', detail: 'Add screenshots, setup steps, architecture notes, examples, and deployment links.', impact: 'High' } : null,
    metrics.Logic < 70 ? { title: 'Show engineering rigor', detail: 'Expose tests, linting, type checks, and clear module boundaries for this project type.', impact: 'High' } : null,
    metrics.Popularity < 65 ? { title: 'Improve discoverability', detail: 'Add demos, release notes, tags, sample data, and short usage videos.', impact: 'Medium' } : null,
    metrics.Versatility < 60 ? { title: 'Add adjacent proof without diluting focus', detail: `For ${primaryTrack.name}, add one adjacent capability that belongs to the same domain.`, impact: 'Medium' } : null,
    { title: 'Create a signature project', detail: `Build one complete ${primaryTrack.name.toLowerCase()} repo with tests, docs, examples, and a clean release story.`, impact: 'High' },
  ];

  return items.filter(isInsightItem).slice(0, 6);
}

function buildWeaknesses(metrics: AnalysisMetrics, repoCount: number, primaryTrack: TrackSignal): InsightItem[] {
  const items: Array<InsightItem | null> = [
    primaryTrack.score < 50 ? { title: 'Unclear project archetype', detail: 'The language mix does not strongly identify the work as frontend, backend, systems, data, platform, or full stack.', impact: 'High' as const } : null,
    metrics.Documentation < 65 ? { title: 'Weak storytelling', detail: 'The algorithmic signal says the work may be stronger than the way it is presented.', impact: 'High' as const } : null,
    metrics.Logic < 62 ? { title: 'Quality proof missing', detail: 'Add visible tests, automation, examples, or architecture notes for the actual project type.', impact: 'High' as const } : null,
    metrics.Popularity < 50 ? { title: 'Low outside pull', detail: 'Improve names, descriptions, demos, and README previews so people can understand the value faster.', impact: 'Medium' as const } : null,
    repoCount < 4 ? { title: 'Thin public portfolio', detail: 'Add or polish a few complete repos instead of many unfinished experiments.', impact: 'Medium' as const } : null,
  ];

  return items.filter(isInsightItem);
}

function buildFingerprint(target: Target, metrics: AnalysisMetrics, primaryTrack: TrackSignal): InsightItem[] {
  const languages = significantLanguages(target.languageTags);
  const repoCount = repoCountOf(target);
  return [
    { title: 'Detected Archetype', detail: `${primaryTrack.name} with ${primaryTrack.score}/100 confidence.` },
    { title: 'Primary Stack', detail: `${languages[0]?.name || 'Unknown'} carries ${languages[0]?.pct || 0}% of the visible code mix.` },
    { title: 'Public Footprint', detail: `${repoCount} analyzed ${repoCount === 1 ? 'repo' : 'repos'} with Dev IQ ${target.devIq.toLocaleString()}.` },
    { title: 'Signal Shape', detail: `Strongest local axis is ${Object.entries(metrics).sort((a, b) => (b[1] || 0) - (a[1] || 0))[0]?.[0] || 'Logic'}.` },
  ];
}

function buildTimeline(target: Target, metrics: AnalysisMetrics, primaryTrack: TrackSignal): TimelineItem[] {
  const languages = significantLanguages(target.languageTags);
  const repoCount = repoCountOf(target);
  return [
    { label: 'Archetype', detail: `${primaryTrack.name} became the strongest visible lane.`, intensity: primaryTrack.score },
    { label: 'Foundation', detail: `${languages[0]?.name || 'Core stack'} is the main public skill area.`, intensity: clamp(metrics.Logic) },
    { label: 'Portfolio', detail: `${repoCount} ${repoCount === 1 ? 'repo is' : 'repos are'} represented in this analysis.`, intensity: clamp(45 + repoCount * 2) },
    { label: 'Market Signal', detail: `Dev IQ reached ${target.devIq.toLocaleString()} through GitHub scoring.`, intensity: clamp(metrics.Popularity) },
  ];
}

function buildExplanations(target: Target, metrics: AnalysisMetrics, roles: RoleFit[], primaryTrack: TrackSignal, maturitySummary: string) {
  const name = getTargetName(target);
  const bestRole = roles[0]?.role || 'Generalist Engineer';
  return {
    recruiter: `${name} fits best as a ${bestRole}. The algorithm detected ${primaryTrack.name}, so it is not penalizing the profile for missing unrelated frontend/backend pieces.`,
    cto: `${name} has a algorithmic engineering score of ${weightedLocalScore(metrics, primaryTrack)}/100. It is being judged against ${primaryTrack.name} expectations, with Dev IQ and language complexity included.`,
    peer: `The profile reads strongest as ${primaryTrack.name}. The next lift is to make quality gates, examples, and runtime/setup proof obvious for that lane.`,
    beginner: `This score first detects what kind of software the project is. A frontend-only app, backend-only service, systems repo, or data project is graded by its own lane instead of one generic checklist.`,
    report: maturitySummary || 'No Deep Analysis explanation was returned for this analysis.',
  };
}

export function createLocalFeaturePack(target: Target, kind: 'dev' | 'repo'): LocalFeaturePack {
  const name = getTargetName(target);
  const kindLabel = kind === 'dev' ? 'Developer' : 'Repository';
  if (target.advancedAnalysis) {
    return createBackendFeaturePack(target.advancedAnalysis, name, kindLabel, target);
  }

  const trackSignals = buildTrackSignals(target);
  const primaryTrack = trackSignals[0] || { name: 'General Software', score: 45, evidence: ['Insufficient language evidence'] };
  const metrics = buildLocalMetrics(target, kind, trackSignals);
  const algorithmicScore = weightedLocalScore(metrics, primaryTrack);
  const roles = buildRoleFits(target, metrics, trackSignals);
  const health = buildHealth(target, metrics, trackSignals);
  const repoCount = repoCountOf(target);
  const weaknesses = buildWeaknesses(metrics, repoCount, primaryTrack);
  const strengths = [
    primaryTrack.score >= 70 ? `Strong ${primaryTrack.name} fit` : '',
    metrics.Logic >= 70 ? 'Strong implementation depth' : '',
    metrics.Documentation >= 70 ? 'Good public presentation' : '',
    metrics.Popularity >= 65 ? 'Healthy community/traction signal' : '',
  ].filter(Boolean);

  return {
    name,
    kindLabel,
    algorithmicScore,
    algorithmicMetrics: metrics,
    primaryTrack,
    trackSignals,
    languageDistribution: buildLanguageDistribution(target.languageTags),
    roadmap: buildRoadmap(metrics, primaryTrack),
    roleFits: roles,
    codebaseHealth: health,
    hireabilityReport: {
      grade: gradeFromScore(algorithmicScore),
      summary: `${name} has a ${gradeFromScore(algorithmicScore)} local ${kindLabel.toLowerCase()} signal as ${primaryTrack.name}. The score is track-aware, so missing unrelated layers are not counted as failure.`,
      strengths: strengths.length ? strengths : ['Clear public GitHub signal exists'],
      risks: weaknesses.slice(0, 4).map((item) => item.title),
      bestFitRoles: roles.slice(0, 3).map((role) => role.role),
      interviewTalkingPoints: [
        `Explain the strongest ${primaryTrack.name.toLowerCase()} repository from architecture to delivery.`,
        'Show where testing, quality checks, or review discipline appear.',
        'Discuss why the dominant language stack was chosen.',
        'Name one concrete improvement that would make the work more production-ready.',
      ],
    },
    contributionFingerprint: buildFingerprint(target, metrics, primaryTrack),
    timeline: buildTimeline(target, metrics, primaryTrack),
    explanations: buildExplanations(target, metrics, roles, primaryTrack, target.maturityAnalysis?.summary || target.seniorityAnalysis?.summary || ''),
    deepAnalysis: (target.maturityAnalysis && target.maturityAnalysis.remarks) ? {
      summary: target.maturityAnalysis.summary,
      architecture: target.maturityAnalysis.architecture || '',
      modernity: target.maturityAnalysis.modernity || '',
      security: target.maturityAnalysis.security || '',
      scalability: target.maturityAnalysis.scalability || '',
      remarks: target.maturityAnalysis.remarks
    } : (target.seniorityAnalysis && target.seniorityAnalysis.remarks) ? {
      summary: target.seniorityAnalysis.summary,
      architecture: target.seniorityAnalysis.architecture || '',
      modernity: target.seniorityAnalysis.modernity || '',
      security: target.seniorityAnalysis.security || '',
      scalability: target.seniorityAnalysis.scalability || '',
      remarks: target.seniorityAnalysis.remarks
    } : undefined,
    weaknessDetector: weaknesses,
    securityScore: metrics.Security || 50,
    vulnerabilities: [],
    dependencyRisks: [],
    architectureFindings: [],
    codeSmells: [],
    testQuality: {
      score: metrics.Testing || (metrics.Logic > 65 ? 60 : 40),
      evidence: ['Local fallback has no scanned source findings from the backend.'],
      gaps: ['Run the backend analyzer to populate strict test evidence.'],
    },
    productionReadiness: {
      score: metrics.Production || (metrics.Documentation > 65 ? 58 : 42),
      evidence: ['Local fallback is based on GitHub language/profile metrics only.'],
      blockers: metrics.Security && metrics.Security < 60 ? ['Security score is weak in fallback metrics.'] : [],
    },
    confidenceBreakdown: [
      { label: 'Fallback', score: 35, detail: 'No backend file-level scan was available for this result.' },
    ],
    severityCounts: { critical: 0, high: 0, medium: 0, low: 0 },
    shareCard: {
      title: name,
      subtitle: `${primaryTrack.name} Score ${algorithmicScore}/100`,
      highlights: [
        `Dev IQ ${target.devIq.toLocaleString()}`,
        `Best fit: ${roles[0]?.role || 'Generalist'}`,
        `Top stack: ${significantLanguages(target.languageTags)[0]?.name || 'Unknown'}`,
      ],
    },
  };
}

function createBackendFeaturePack(advanced: AdvancedAnalysis, name: string, kindLabel: string, target: Target): LocalFeaturePack {
  const vulnerabilities = advanced.vulnerabilities || [];
  const dependencyRisks = advanced.dependencyRisks || [];
  const architectureFindings = advanced.architectureFindings || [];
  const codeSmells = advanced.codeSmells || [];
  const securityScore = advanced.securityScore ?? advanced.metrics.Security ?? 50;
  const severityCounts = advanced.severityCounts || { critical: 0, high: 0, medium: 0, low: 0 };
  const testQuality = advanced.testQuality || {
    score: advanced.metrics.Testing || 50,
    evidence: ['Backend did not return detailed test evidence.'],
    gaps: [],
  };
  const productionReadiness = advanced.productionReadiness || {
    score: advanced.metrics.Production || 50,
    evidence: ['Backend did not return detailed production evidence.'],
    blockers: [],
  };
  const explanations = buildExplanations(
    target,
    advanced.metrics,
    advanced.roleFits,
    advanced.primaryTrack,
    target.maturityAnalysis?.summary || target.seniorityAnalysis?.summary || '',
  );

  return {
    name,
    kindLabel,
    algorithmicScore: advanced.algorithmicScore,
    algorithmicMetrics: advanced.metrics,
    primaryTrack: advanced.primaryTrack,
    trackSignals: advanced.trackSignals,
    languageDistribution: advanced.languageDistribution,
    roadmap: advanced.roadmap,
    roleFits: advanced.roleFits,
    codebaseHealth: advanced.codebaseHealth,
    hireabilityReport: {
      grade: gradeFromScore(advanced.algorithmicScore),
      summary: `${name} has a ${gradeFromScore(advanced.algorithmicScore)} backend-computed ${kindLabel.toLowerCase()} signal as ${advanced.primaryTrack.name}. Confidence: ${advanced.confidence}/100.`,
      strengths: [
        advanced.primaryTrack.score >= 70 ? `Strong ${advanced.primaryTrack.name} fit` : '',
        advanced.metrics.Logic >= 70 ? 'Strong implementation depth' : '',
        advanced.metrics.Documentation >= 70 ? 'Good public presentation' : '',
        advanced.metrics.Popularity >= 65 ? 'Healthy reach signal' : '',
      ].filter(Boolean),
      risks: [
        ...vulnerabilities.slice(0, 2).map((item) => item.title),
        ...advanced.weaknessDetector.slice(0, 4).map((item) => item.title),
      ].slice(0, 4),
      bestFitRoles: advanced.roleFits.slice(0, 3).map((role) => role.role),
      interviewTalkingPoints: [
        `Explain the strongest ${advanced.primaryTrack.name.toLowerCase()} repository from architecture to delivery.`,
        `Defend the security score: ${securityScore}/100 with ${severityCounts.critical + severityCounts.high} critical/high issue(s).`,
        'Show where testing, quality checks, or review discipline appear.',
        'Discuss why the dominant language stack was chosen.',
      ],
    },
    contributionFingerprint: advanced.contributionFingerprint,
    timeline: advanced.timeline,
    explanations,
    deepAnalysis: advanced.deepAnalysis,
    weaknessDetector: advanced.weaknessDetector,
    securityScore,
    vulnerabilities,
    dependencyRisks,
    architectureFindings,
    codeSmells,
    testQuality,
    productionReadiness,
    confidenceBreakdown: advanced.confidenceBreakdown || [],
    severityCounts,
    evidenceSummary: advanced.evidenceSummary,
    shareCard: {
      title: name,
      subtitle: `${advanced.primaryTrack.name} Score ${advanced.algorithmicScore}/100`,
      highlights: [
        `Dev IQ ${target.devIq.toLocaleString()}`,
        `Security ${securityScore}/100`,
        `Confidence ${advanced.confidence}/100`,
      ],
    },
  };
}

export function createBattleInsights(left: LocalFeaturePack, right: LocalFeaturePack) {
  const scoreWinner = left.algorithmicScore === right.algorithmicScore ? 'Tie' : left.algorithmicScore > right.algorithmicScore ? left.name : right.name;
  const trackNote = left.primaryTrack.name === right.primaryTrack.name
    ? `Both are competing in ${left.primaryTrack.name}.`
    : `${left.name} is ${left.primaryTrack.name}; ${right.name} is ${right.primaryTrack.name}. Compare by lane, not a generic full-stack checklist.`;
  const underdog = left.algorithmicScore < right.algorithmicScore && left.primaryTrack.score > right.primaryTrack.score
    ? left.name
    : right.algorithmicScore < left.algorithmicScore && right.primaryTrack.score > left.primaryTrack.score
      ? right.name
      : 'No clear underdog edge';

  return [
    { title: 'Overall algorithmic winner', detail: scoreWinner === 'Tie' ? 'Both sides are close on algorithmic signal.' : `${scoreWinner} leads by track-aware local scoring.` },
    { title: 'Track Context', detail: trackNote },
    { title: 'Production-Ready Edge', detail: (left.codebaseHealth.overall > right.codebaseHealth.overall ? left : right).name + ' has the stronger health profile for its detected lane.' },
    { title: 'Underdog Advantage', detail: underdog === 'No clear underdog edge' ? underdog : `${underdog} trails overall but has stronger lane fit.` },
  ];
}
