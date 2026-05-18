export interface RepoLanguageStats {
  [language: string]: number;
}

export interface AnalysisMetrics {
  Logic: number;
  Documentation: number;
  Versatility: number;
  Popularity: number;
  Security?: number;
  Architecture?: number;
  Modernity?: number;
  Testing?: number;
  Dependencies?: number;
  Maintainability?: number;
  Production?: number;
  [key: string]: number | undefined;
}

export interface InsightItem {
  title: string;
  detail: string;
  impact?: "High" | "Medium" | "Low";
}

export interface TrackSignal {
  name: string;
  score: number;
  evidence: string[];
}

export interface LanguageUsage {
  name: string;
  pct: number;
  color: string;
}

export interface HealthCategory {
  label: string;
  score: number;
  evidence: string;
}

export type Severity = "critical" | "high" | "medium" | "low";

export interface SecurityFinding {
  ruleId: string;
  title: string;
  detail: string;
  severity: Severity;
  file?: string;
  line?: number;
  recommendation: string;
  confidence: number;
}

export interface DependencyRisk {
  title: string;
  detail: string;
  severity: Severity;
  ecosystem: string;
  packageName?: string;
  version?: string | undefined;
  source?: "heuristic" | "osv" | "deps.dev" | "scorecard" | "github";
  recommendation: string;
}

export interface DependencyQuery {
  ecosystem: string;
  packageName: string;
  version?: string | undefined;
  manifest: string;
}

export interface ExternalDependencySignal {
  ecosystem: string;
  packageName: string;
  version?: string | undefined;
  vulnerabilityId?: string | undefined;
  title: string;
  detail: string;
  severity: Severity;
  source: "osv" | "deps.dev" | "github";
  recommendation: string;
}

export interface ExternalRepoSignal {
  source: "scorecard" | "github";
  title: string;
  detail: string;
  severity: Severity;
  score?: number | undefined;
  recommendation: string;
}

export interface ExternalAnalysisSignals {
  dependencySignals: ExternalDependencySignal[];
  repoSignals: ExternalRepoSignal[];
  dependencyQueries: DependencyQuery[];
  sources: string[];
}

export interface EvidenceSummary {
  filesScanned: number;
  sourceFilesScanned: number;
  configFilesScanned: number;
  bytesScanned: number;
  truncated: boolean;
}

export interface AdvancedAnalysis {
  algorithmicScore: number;
  metrics: AnalysisMetrics;
  primaryTrack: TrackSignal;
  trackSignals: TrackSignal[];
  languageDistribution: LanguageUsage[];
  roleFits: Array<{ role: string; score: number; matched: string[]; gaps: string[] }>;
  codebaseHealth: { overall: number; categories: HealthCategory[]; blockers: string[] };
  roadmap: InsightItem[];
  weaknessDetector: InsightItem[];
  contributionFingerprint: InsightItem[];
  timeline: Array<{ label: string; detail: string; intensity: number }>;
  confidence: number;
  securityScore: number;
  vulnerabilities: SecurityFinding[];
  dependencyRisks: DependencyRisk[];
  architectureFindings: InsightItem[];
  codeSmells: InsightItem[];
  testQuality: { score: number; evidence: string[]; gaps: string[] };
  productionReadiness: { score: number; evidence: string[]; blockers: string[] };
  confidenceBreakdown: Array<{ label: string; score: number; detail: string }>;
  severityCounts: Record<Severity, number>;
  evidenceSummary: EvidenceSummary;
  externalSignals?: ExternalAnalysisSignals | undefined;
  deepAnalysis?: {
    summary: string;
    architecture: string;
    modernity: string;
    security: string;
    scalability: string;
    remarks: Array<{ topic: string; remark: string }>;
  } | undefined;
}

export interface FileSignal {
  name: string;
  content: string;
}

export interface TreeItem {
  path?: string;
  type?: string;
  size?: number;
}

interface FileSignals {
  readmeLength: number;
  packageScripts: string[];
  hasTests: boolean;
  hasBuild: boolean;
  hasLint: boolean;
  hasCI: boolean;
  hasDocker: boolean;
  hasConfig: boolean;
  hasSecurity: boolean;
  hasExamples: boolean;
  hasLockfile: boolean;
  hasEnvExample: boolean;
  hasSource: boolean;
  hasValidation: boolean;
  hasRateLimit: boolean;
  testFileCount: number;
  sourceFileCount: number;
  configFileCount: number;
  toolingRigor: number;
}

type ParsedLanguage = { name: string; pct: number; bytes: number };

const LANGUAGE_COLORS = ["#38bdf8", "#818cf8", "#f59e0b", "#10b981", "#f43f5e", "#a78bfa", "#22c55e", "#eab308"];

const COMPLEXITY: Record<string, number> = {
  C: 96,
  "C++": 95,
  Rust: 94,
  Zig: 90,
  Assembly: 98,
  Go: 84,
  Java: 82,
  Scala: 86,
  "C#": 80,
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
  "Jupyter Notebook": 62,
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
  Erlang: 90,
};

const ROLE_PROFILES = [
  { role: "Frontend Engineer", languages: ["TypeScript", "JavaScript", "HTML", "CSS", "Vue", "Svelte", "Astro", "MDX", "React", "Next.js"], track: "Frontend Product" },
  { role: "Backend Engineer", languages: ["Python", "Go", "Java", "Rust", "C#", "Ruby", "PHP", "Elixir", "Scala", "Kotlin", "TypeScript", "Node.js", "GraphQL"], track: "Backend / API" },
  { role: "Full Stack Engineer", languages: ["TypeScript", "JavaScript", "Python", "Go", "Java", "HTML", "CSS", "React", "Node.js"], track: "Full Stack Product" },
  { role: "Systems Engineer", languages: ["C", "C++", "Rust", "Zig", "Assembly", "Objective-C", "Nim", "Crystal"], track: "Systems / Low Level" },
  { role: "DevOps / Platform Engineer", languages: ["Shell", "Go", "Python", "HCL", "Dockerfile", "Makefile", "Nix", "YAML", "Kubernetes", "Ansible"], track: "DevOps / Platform" },
  { role: "ML / Data Engineer", languages: ["Python", "Jupyter Notebook", "R", "Julia", "Scala", "MATLAB", "SQL"], track: "ML / Data" },
  { role: "Mobile Engineer", languages: ["Swift", "Kotlin", "Dart", "Objective-C", "Java", "TypeScript"], track: "Mobile Product" },
  { role: "Web3 / Smart Contract Engineer", languages: ["Solidity", "Rust", "TypeScript", "Go", "Vyper"], track: "Web3 / Crypto" },
  { role: "Game Developer", languages: ["C++", "C#", "HLSL", "GLSL", "Lua", "Rust"], track: "Game Development" },
  { role: "Security Engineer", languages: ["Python", "C", "Assembly", "Rust", "Go", "Shell", "Ruby"], track: "Security / Research" },
];

export const BASE_TARGET_FILES = [
  "README.md",
  "SECURITY.md",
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lockb",
  "tsconfig.json",
  "jsconfig.json",
  "vite.config.ts",
  "next.config.js",
  "Dockerfile",
  "docker-compose.yml",
  "compose.yml",
  ".env.example",
  ".github/workflows/ci.yml",
  ".github/workflows/main.yml",
  "requirements.txt",
  "pyproject.toml",
  "Pipfile",
  "Cargo.toml",
  "Cargo.lock",
  "go.mod",
  "go.sum",
  "composer.json",
  "Gemfile",
  "pom.xml",
  "build.gradle",
];

const BATTLE_TARGET_FILES = [
  "README.md",
  "SECURITY.md",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "Dockerfile",
  ".github/workflows/ci.yml",
  ".env.example",
];

const SOURCE_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".cs",
  ".php",
  ".rb",
  ".sol",
  ".vue",
  ".svelte",
  ".dart",
  ".swift",
  ".kt",
  ".kts",
  ".c",
  ".cc",
  ".cpp",
  ".h",
  ".hpp",
  ".sql",
  ".sh",
  ".yaml",
  ".yml",
  ".toml",
];

const IGNORED_PATH_PARTS = [
  "node_modules/",
  "vendor/",
  "dist/",
  "build/",
  ".next/",
  ".nuxt/",
  "coverage/",
  ".cache/",
  "target/",
  "bin/",
  "obj/",
  ".git/",
];

const GENERATED_PATH_HINTS = [
  ".min.js",
  ".bundle.js",
  ".lock",
  "generated/",
  "__generated__/",
  ".d.ts",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function basename(path: string) {
  const normalized = path.replace(/\\/g, "/");
  return normalized.split("/").pop() || normalized;
}

function normalizePath(path: string) {
  return path.replace(/\\/g, "/").replace(/^\/+/, "");
}

function isIgnoredPath(path: string) {
  const lower = normalizePath(path).toLowerCase();
  return IGNORED_PATH_PARTS.some((part) => lower.includes(part));
}

function isGeneratedPath(path: string) {
  const lower = normalizePath(path).toLowerCase();
  return GENERATED_PATH_HINTS.some((hint) => lower.includes(hint));
}

function hasSourceExtension(path: string) {
  const lower = normalizePath(path).toLowerCase();
  return SOURCE_EXTENSIONS.some((extension) => lower.endsWith(extension)) || basename(lower) === "dockerfile";
}

function isSourceFile(file: FileSignal) {
  const path = normalizePath(file.name).toLowerCase();
  if (isIgnoredPath(path) || isGeneratedPath(path)) return false;
  if (/(^|\/)(test|tests|spec|__tests__|fixtures|mocks)(\/|$)/.test(path)) return false;
  if (/\.(test|spec)\.[tj]sx?$/.test(path)) return false;
  return hasSourceExtension(path) && !isConfigFileName(path);
}

function isTestFile(file: FileSignal) {
  const path = normalizePath(file.name).toLowerCase();
  return /(^|\/)(test|tests|spec|__tests__)(\/|$)/.test(path) || /\.(test|spec)\.[tj]sx?$/.test(path) || /test_.*\.py$/.test(path);
}

function isConfigFileName(path: string) {
  const name = basename(path).toLowerCase();
  return /(^|\/)\.github\/workflows\//.test(path)
    || [
      "readme.md",
      "security.md",
      "package.json",
      "package-lock.json",
      "pnpm-lock.yaml",
      "yarn.lock",
      "bun.lockb",
      "tsconfig.json",
      "jsconfig.json",
      "vite.config.ts",
      "vite.config.js",
      "next.config.js",
      "dockerfile",
      "docker-compose.yml",
      "compose.yml",
      ".env.example",
      "requirements.txt",
      "pyproject.toml",
      "pipfile",
      "cargo.toml",
      "cargo.lock",
      "go.mod",
      "go.sum",
      "composer.json",
      "gemfile",
      "pom.xml",
      "build.gradle",
    ].includes(name);
}

function scorePathForEvidence(path: string) {
  const lower = normalizePath(path).toLowerCase();
  if (isIgnoredPath(lower)) return -100;
  if (BASE_TARGET_FILES.some((target) => target.toLowerCase() === lower)) return 120;
  if (/^\.github\/workflows\/.+\.ya?ml$/.test(lower)) return 105;
  if (/(auth|security|middleware|permission|policy|guard|jwt|session|login|oauth)/.test(lower)) return 95;
  if (/(api|route|routes|controller|server|handler|endpoint|webhook)/.test(lower)) return 88;
  if (/(db|database|query|repository|model|schema|prisma|migration)/.test(lower)) return 82;
  if (/(config|env|secret|token|cors|helmet|rate|limit)/.test(lower)) return 76;
  if (/(contract|wallet|chain|solidity|payment|billing)/.test(lower)) return 74;
  if (/(src|app|pages|lib|core|service|services|domain|internal)\//.test(lower) && hasSourceExtension(lower)) return 65;
  if (isTestFile({ name: lower, content: "" })) return 42;
  if (hasSourceExtension(lower)) return 50;
  return -10;
}

export function targetFilesForMode(battleMode = false) {
  return battleMode ? BATTLE_TARGET_FILES : BASE_TARGET_FILES;
}

export function selectEvidencePaths(treeItems: TreeItem[], battleMode = false) {
  const limit = battleMode ? 10 : 28;
  const fallback = targetFilesForMode(battleMode);
  if (treeItems.length === 0) return fallback;

  const paths = treeItems
    .filter((item) => item.type === "blob" && item.path)
    .map((item) => normalizePath(item.path || ""))
    .filter((path) => path && !isIgnoredPath(path));

  const scored = paths
    .map((path) => ({
      path,
      score: scorePathForEvidence(path) + Math.max(0, 20 - Math.floor((path.length || 1) / 20)),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.path.length - b.path.length);

  const selected: string[] = [];
  const pushUnique = (path: string) => {
    if (!selected.some((existing) => existing.toLowerCase() === path.toLowerCase())) selected.push(path);
  };

  for (const target of fallback) {
    const exact = paths.find((path) => path.toLowerCase() === target.toLowerCase());
    if (exact) pushUnique(exact);
  }

  for (const item of scored) {
    pushUnique(item.path);
    if (selected.length >= limit) break;
  }

  return selected.slice(0, limit);
}

export function calculateDevIQ(repos: any[], languagesArray: RepoLanguageStats[], followers = 0) {
  let devIq = 0;

  const constants: Record<string, number> = {
    Assembly: 15,
    C: 25,
    "C++": 25,
    Rust: 25,
    Zig: 25,
    Solidity: 30,
    Vyper: 30,
    Haskell: 30,
    Clojure: 35,
    Scala: 35,
    Java: 40,
    "C#": 40,
    Kotlin: 40,
    Swift: 40,
    Go: 40,
    TypeScript: 35,
    JavaScript: 35,
    Python: 35,
    Ruby: 35,
    PHP: 35,
    Dart: 40,
    Shell: 45,
    Dockerfile: 45,
    HCL: 45,
    HTML: 45,
    CSS: 45,
  };

  const multipliers: Record<string, number> = {
    Assembly: 6.5,
    Rust: 6.0,
    Zig: 6.0,
    Haskell: 5.5,
    Solidity: 5.5,
    Vyper: 5.5,
    "C++": 5.0,
    C: 5.0,
    Go: 4.5,
    Clojure: 4.5,
    Scala: 4.5,
    Java: 4.0,
    "C#": 4.0,
    Kotlin: 4.0,
    Swift: 3.5,
    TypeScript: 3.2,
    Dart: 3.0,
    Python: 2.8,
    Ruby: 2.8,
    JavaScript: 2.5,
    PHP: 2.5,
    Shell: 2.0,
    Dockerfile: 2.0,
    HCL: 2.0,
    HTML: 1.0,
    CSS: 1.0,
  };

  for (const langStats of languagesArray) {
    for (const [lang, bytes] of Object.entries(langStats)) {
      const constant = constants[lang] || 40;
      const multiplier = multipliers[lang] || 2.2;
      const lines = bytes / constant;
      devIq += lines * multiplier;
    }
  }

  for (const repo of repos) {
    if (repo.stargazers_count) devIq += repo.stargazers_count * 50;
    if (repo.forks_count) devIq += repo.forks_count * 150;
    if (repo.license) devIq += 500;

    if (repo.created_at && repo.updated_at) {
      const created = new Date(repo.created_at).getTime();
      const updated = new Date(repo.updated_at).getTime();
      if (!isNaN(created) && !isNaN(updated)) {
        const longevityMonths = Math.max(1, (updated - created) / (1000 * 60 * 60 * 24 * 30));
        if (longevityMonths > 6) devIq += longevityMonths * 100;
        if (longevityMonths > 24) devIq += 2000;
      }
    }

    if (typeof repo.open_issues_count === "number") {
      const issueRatio = repo.open_issues_count / (repo.stargazers_count || 1);
      if (issueRatio < 0.1 && repo.stargazers_count > 10) devIq += 300;
    }
  }

  const networkMultiplier = 1 + Math.min(followers / 100, 1.5);
  const finalIq = Math.round(devIq * networkMultiplier);
  return isNaN(finalIq) ? 0 : finalIq;
}

export function buildLanguageProfile(languageStats: RepoLanguageStats[]) {
  const totals: Record<string, number> = {};
  let totalBytes = 0;

  for (const stats of languageStats) {
    for (const [language, bytes] of Object.entries(stats)) {
      totals[language] = (totals[language] || 0) + bytes;
      totalBytes += bytes;
    }
  }

  const languages = Object.entries(totals)
    .map(([name, bytes]) => ({ name, bytes, pct: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0 }))
    .filter((language) => language.pct > 0)
    .sort((a, b) => b.pct - a.pct);

  return {
    totals,
    languages,
    languageTags: languages.map((language) => `${language.pct}% ${language.name}`),
  };
}

function languagePct(languages: ParsedLanguage[], names: string[]) {
  return languages.filter((language) => names.includes(language.name)).reduce((sum, language) => sum + language.pct, 0);
}

function devIqSignal(devIq: number) {
  return clamp((Math.log10(Math.max(devIq, 100)) - 3) * 18);
}

function complexitySignal(languages: ParsedLanguage[]) {
  if (languages.length === 0) return 40;
  return clamp(languages.reduce((sum, language) => sum + (COMPLEXITY[language.name] || 58) * (language.pct / 100), 0));
}

function focusSignal(languages: ParsedLanguage[]) {
  const dominant = languages[0]?.pct || 0;
  const majorCount = languages.filter((language) => language.pct >= 8).length;
  if (dominant >= 82) return clamp(76 + (dominant - 82) * 0.6);
  if (majorCount >= 3) return 74;
  if (majorCount === 2) return 68;
  return 58;
}

function buildLanguageDistribution(languages: ParsedLanguage[]): LanguageUsage[] {
  const major = languages.filter((language) => language.pct >= 3 || ["TypeScript", "JavaScript", "Python", "Rust", "Go", "C", "C++", "Java", "C#"].includes(language.name));
  const minorTotal = languages
    .filter((language) => language.pct > 0 && !major.some((majorLanguage) => majorLanguage.name === language.name))
    .reduce((sum, language) => sum + language.pct, 0);
  const distribution = major.length > 0 ? [...major] : languages.slice(0, 1);
  if (minorTotal > 0) distribution.push({ name: "Other", pct: minorTotal, bytes: 0 });

  return distribution.map((language, index) => ({
    name: language.name,
    pct: clamp(language.pct),
    color: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length],
  }));
}

function analyzeFileSignals(files: FileSignal[]): FileSignals {
  const readme = files.find((file) => basename(file.name).toLowerCase() === "readme.md")?.content || "";
  const packageFiles = files.filter((file) => basename(file.name).toLowerCase() === "package.json");
  let packageScripts: string[] = [];

  for (const packageFile of packageFiles) {
    try {
      const parsed = JSON.parse(packageFile.content) as { scripts?: Record<string, string> };
      packageScripts = [...packageScripts, ...Object.keys(parsed.scripts || {})];
    } catch {
      packageScripts = packageScripts;
    }
  }

  const allContent = files.map((file) => `${file.name}\n${file.content}`).join("\n").toLowerCase();
  const sourceFileCount = files.filter(isSourceFile).length;
  const testFileCount = files.filter(isTestFile).length;
  const configFileCount = files.filter((file) => isConfigFileName(normalizePath(file.name).toLowerCase())).length;
  const hasTests = testFileCount > 0 || /test|spec|coverage|vitest|jest|pytest|unittest|mocha|playwright|cypress/.test(allContent);

  return {
    readmeLength: readme.trim().length,
    packageScripts,
    hasTests,
    hasBuild: packageScripts.some((script) => /build|compile|bundle/i.test(script)),
    hasLint: packageScripts.some((script) => /lint|format|type-check|typecheck/i.test(script)) || /eslint|prettier|ruff|black|clippy|golangci/.test(allContent),
    hasCI: files.some((file) => normalizePath(file.name).toLowerCase().includes(".github/workflows/")),
    hasDocker: files.some((file) => /(^|\/)(dockerfile|docker-compose\.ya?ml|compose\.ya?ml)$/i.test(normalizePath(file.name))),
    hasConfig: files.some((file) => isConfigFileName(normalizePath(file.name).toLowerCase())),
    hasSecurity: files.some((file) => basename(file.name).toLowerCase() === "security.md") || /security policy|responsible disclosure|vulnerability/i.test(readme),
    hasExamples: files.some((file) => /example|demo|sample/i.test(file.name) || /example|demo|screenshot|usage/i.test(file.content)),
    hasLockfile: files.some((file) => /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb|cargo\.lock|go\.sum|poetry\.lock|pipfile\.lock|gemfile\.lock)$/i.test(normalizePath(file.name))),
    hasEnvExample: files.some((file) => /(^|\/)\.env\.example$/i.test(normalizePath(file.name))) || /process\.env|import\.meta\.env|env\./i.test(allContent),
    hasSource: sourceFileCount > 0,
    hasValidation: /zod|joi|yup|valibot|class-validator|pydantic|marshmallow|serde|validator|express-validator/i.test(allContent),
    hasRateLimit: /rate-?limit|ratelimit|throttle|slow_down|slowdown/i.test(allContent),
    testFileCount,
    sourceFileCount,
    configFileCount,
    toolingRigor:
      (/eslint|prettier|husky|jest|vitest|cypress|playwright|ruff|clippy|golangci|terraform|docker-compose/i.test(allContent) ? 15 : 0)
      + (/typescript|tsconfig|strict/i.test(allContent) ? 5 : 0)
      + (hasTests ? 6 : 0),
  };
}

function buildTrackSignals(languages: ParsedLanguage[], fileSignals: FileSignals, repoCount: number, devIq: number): TrackSignal[] {
  const frontendCore = languagePct(languages, ["TypeScript", "JavaScript", "HTML", "CSS", "Vue", "Svelte", "Astro", "MDX"]);
  const browserMarkup = languagePct(languages, ["HTML", "CSS", "Vue", "Svelte", "Astro"]);
  const typedJs = languagePct(languages, ["TypeScript"]);
  const backendCore = languagePct(languages, ["Python", "Go", "Java", "Rust", "C#", "Ruby", "PHP", "Elixir", "Scala", "Kotlin", "Erlang", "Clojure"]);
  const nodeBackendAmbiguous = languagePct(languages, ["TypeScript", "JavaScript"]) * (browserMarkup >= 15 ? 0.15 : 0.35);
  const systemsCore = languagePct(languages, ["C", "C++", "Rust", "Zig", "Assembly", "Objective-C", "Nim", "Crystal", "Haskell", "OCaml"]);
  const dataCore = languagePct(languages, ["Python", "Jupyter Notebook", "R", "Julia", "Scala", "MATLAB", "SQL"]);
  const devopsCore = languagePct(languages, ["Shell", "Dockerfile", "HCL", "Makefile", "Nix", "YAML"]);
  const mobileCore = languagePct(languages, ["Swift", "Kotlin", "Dart", "Objective-C"]);
  const web3Core = languagePct(languages, ["Solidity", "Vyper"]) + languagePct(languages, ["Rust", "Go", "TypeScript"]) * 0.2;
  const gameCore = languagePct(languages, ["C++", "C#", "Lua", "HLSL", "GLSL"]);
  const securityCore = languagePct(languages, ["Python", "C", "Assembly", "Rust", "Go", "Shell"]) * 0.4;
  const repoBoost = Math.min(repoCount, 20) * 0.35;
  const scale = devIqSignal(devIq) * 0.18;
  const qualityBoost = (fileSignals.hasTests ? 4 : 0) + (fileSignals.hasCI ? 3 : 0) + (fileSignals.hasConfig ? 2 : 0);

  const frontendScore = clamp(frontendCore * 0.78 + browserMarkup * 0.22 + typedJs * 0.14 + repoBoost + scale + (fileSignals.hasBuild ? 3 : 0) + (fileSignals.hasExamples ? 3 : 0));
  const backendScore = clamp((backendCore + nodeBackendAmbiguous) * 0.86 + repoBoost + scale + qualityBoost + (fileSignals.hasDocker ? 3 : 0));
  const systemsScore = clamp(systemsCore * 0.95 + complexitySignal(languages) * 0.16 + scale + (fileSignals.hasBuild ? 2 : 0));
  const dataScore = clamp(dataCore * 0.78 + languagePct(languages, ["Python"]) * 0.12 + repoBoost + scale + (fileSignals.hasExamples ? 2 : 0));
  const devopsScore = clamp(devopsCore * 0.9 + languagePct(languages, ["Go", "Python"]) * 0.1 + repoBoost + scale + (fileSignals.hasDocker ? 6 : 0) + (fileSignals.hasCI ? 5 : 0));
  const fullStackScore = clamp(Math.min(frontendScore, backendScore) * 1.18 + Math.min(frontendScore + backendScore, 150) * 0.08);
  const mobileScore = clamp(mobileCore * 0.95 + repoBoost + scale);
  const web3Score = clamp(web3Core * 0.88 + repoBoost + scale);
  const gameScore = clamp(gameCore * 0.9 + repoBoost + scale);
  const securityScore = clamp(securityCore * 0.8 + repoBoost + scale + (fileSignals.hasSecurity ? 4 : 0));

  return [
    { name: "Frontend Product", score: frontendScore, evidence: [`Frontend language signal ${clamp(frontendCore)}%`, browserMarkup > 0 ? `UI markup/style signal ${clamp(browserMarkup)}%` : "JS/TS-only frontend evidence possible"] },
    { name: "Backend / API", score: backendScore, evidence: [`Backend language signal ${clamp(backendCore + nodeBackendAmbiguous)}%`, fileSignals.hasValidation ? "Validation library/config signal present" : "No validation library signal found"] },
    { name: "Full Stack Product", score: fullStackScore, evidence: [`Frontend ${frontendScore}/100`, `Backend ${backendScore}/100`] },
    { name: "Systems / Low Level", score: systemsScore, evidence: [`Systems language signal ${clamp(systemsCore)}%`, `Complexity ${complexitySignal(languages)}/100`] },
    { name: "DevOps / Platform", score: devopsScore, evidence: [`Platform language signal ${clamp(devopsCore)}%`, fileSignals.hasCI ? "CI automation visible" : "CI automation not obvious"] },
    { name: "ML / Data", score: dataScore, evidence: [`Data language signal ${clamp(dataCore)}%`, "Python/Jupyter/R/Julia are evaluated as data work"] },
    { name: "Mobile Product", score: mobileScore, evidence: [`Mobile language signal ${clamp(mobileCore)}%`] },
    { name: "Web3 / Crypto", score: web3Score, evidence: [`Web3 language signal ${clamp(web3Core)}%`] },
    { name: "Game Development", score: gameScore, evidence: [`Game dev language signal ${clamp(gameCore)}%`] },
    { name: "Security / Research", score: securityScore, evidence: [`Security language signal ${clamp(securityCore)}%`] },
  ].sort((a, b) => b.score - a.score).filter((track) => track.score > 7);
}

function severityImpact(severity: Severity): "High" | "Medium" | "Low" {
  if (severity === "critical" || severity === "high") return "High";
  if (severity === "medium") return "Medium";
  return "Low";
}

function severityCounts(findings: Array<{ severity: Severity }>): Record<Severity, number> {
  return {
    critical: findings.filter((finding) => finding.severity === "critical").length,
    high: findings.filter((finding) => finding.severity === "high").length,
    medium: findings.filter((finding) => finding.severity === "medium").length,
    low: findings.filter((finding) => finding.severity === "low").length,
  };
}

function lineNumberForIndex(content: string, index: number) {
  return content.slice(0, Math.max(0, index)).split(/\r?\n/).length;
}

function sanitizeFileName(file: FileSignal) {
  return normalizePath(file.name);
}

function isPlaceholderSecret(value: string) {
  const lower = value.toLowerCase();
  return /process\.env|import\.meta\.env|example|sample|dummy|placeholder|changeme|change_me|replace_me|your_|xxx|redacted|secret_here|token_here|<|>|\$\{/.test(lower);
}

function buildSecurityAudit(files: FileSignal[]) {
  const findings: SecurityFinding[] = [];
  const seen = new Set<string>();

  const addFinding = (finding: SecurityFinding) => {
    const key = `${finding.ruleId}:${finding.file || ""}:${finding.line || 0}:${finding.title}`;
    if (seen.has(key)) return;
    if (findings.length >= 60) return;
    seen.add(key);
    findings.push(finding);
  };

  const addRegexFinding = (
    ruleId: string,
    severity: Severity,
    title: string,
    regex: RegExp,
    detail: string,
    recommendation: string,
    confidence = 80,
    maxMatches = 4,
  ) => {
    let matches = 0;
    for (const file of files) {
      if (matches >= maxMatches) break;
      const content = file.content;
      let match: RegExpExecArray | null;
      const globalRegex = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : `${regex.flags}g`);
      while ((match = globalRegex.exec(content)) && matches < maxMatches) {
        addFinding({
          ruleId,
          severity,
          title,
          detail,
          file: sanitizeFileName(file),
          line: lineNumberForIndex(content, match.index),
          recommendation,
          confidence,
        });
        matches += 1;
      }
    }
  };

  addRegexFinding("secret.github-token", "critical", "GitHub token committed", /gh[pousr]_[A-Za-z0-9_]{30,255}/, "A GitHub token-like value appears in scanned files.", "Revoke the token, move it to a secret manager, and rotate any downstream credentials.", 95, 6);
  addRegexFinding("secret.aws-access-key", "critical", "AWS access key committed", /AKIA[0-9A-Z]{16}/, "An AWS access key pattern appears in scanned files.", "Revoke the key, rotate IAM credentials, and use environment-bound secrets.", 95, 4);
  addRegexFinding("secret.private-key", "critical", "Private key material committed", /-----BEGIN (?:RSA |EC |OPENSSH |DSA |)?PRIVATE KEY-----/, "Private key material appears in the repository.", "Remove the key from history, rotate it, and load private keys only from secure runtime storage.", 95, 2);
  addRegexFinding("secret.stripe", "critical", "Payment secret committed", /sk_(?:live|test)_[A-Za-z0-9]{16,}/, "A Stripe secret-key pattern appears in scanned files.", "Rotate the key and move payment secrets to environment variables or platform secrets.", 92, 4);
  addRegexFinding("secret.google-api-key", "high", "Google API key committed", /AIza[0-9A-Za-z\-_]{35}/, "A Google API key pattern appears in scanned files.", "Restrict, rotate, and move API keys out of source control.", 88, 4);
  addRegexFinding("secret.slack-token", "critical", "Slack token committed", /xox[baprs]-[A-Za-z0-9-]{20,}/, "A Slack token pattern appears in scanned files.", "Revoke the token and load it from a secret manager.", 94, 4);

  for (const file of files) {
    const genericSecret = /\b(api[_-]?key|secret|token|password|passwd|pwd|client_secret|private_key)\b\s*[:=]\s*["'`]([^"'`\n]{12,})["'`]/gi;
    let match: RegExpExecArray | null;
    while ((match = genericSecret.exec(file.content))) {
      const value = match[2] || "";
      if (isPlaceholderSecret(value)) continue;
      addFinding({
        ruleId: "secret.generic-hardcoded",
        severity: /password|private|client_secret|secret/i.test(match[1] || "") ? "high" : "medium",
        title: "Hardcoded credential-like value",
        detail: "A credential-looking assignment is hardcoded instead of being read from runtime configuration.",
        file: sanitizeFileName(file),
        line: lineNumberForIndex(file.content, match.index),
        recommendation: "Move credentials to environment variables or a secret manager and keep only examples in source.",
        confidence: 78,
      });
    }
  }

  addRegexFinding("js.eval", "high", "Dynamic code execution", /\b(eval|setTimeout|setInterval)\s*\(\s*(?:req|request|ctx|event|input|params|query|body|window\.location|location\.)/i, "User-controlled values appear to flow into dynamic code execution.", "Replace dynamic evaluation with explicit parsing and allowlisted operations.", 84);
  addRegexFinding("js.function-constructor", "high", "Function constructor execution", /new\s+Function\s*\(/, "The Function constructor can execute arbitrary strings as code.", "Remove string-built code execution paths.", 82);
  addRegexFinding("js.command-injection", "high", "Command execution with dynamic input", /\b(?:exec|execSync|spawn|spawnSync)\s*\(\s*(?:req|request|ctx|event|input|params|query|body|`[^`]*\$\{)/i, "A shell/process execution call appears to receive dynamic input.", "Use argument arrays, strict allowlists, and avoid shell interpolation.", 86);
  addRegexFinding("py.command-injection", "high", "Python shell execution risk", /(?:subprocess\.(?:run|call|Popen)|os\.system)\s*\([^)]*shell\s*=\s*True/i, "Python subprocess execution enables shell interpretation.", "Use shell=false with fixed command arrays and validate every argument.", 84);
  addRegexFinding("sql.template-injection", "high", "SQL query interpolation", /(?:query|execute|raw|sql)\s*\(\s*`[^`]*\$\{|(?:query|execute)\s*\([^)]*\+\s*(?:req|request|input|params|query|body)/i, "SQL strings appear to be built from interpolation or concatenation.", "Use parameterized queries or ORM bind variables only.", 86);
  addRegexFinding("sql.unsafe-raw", "high", "Unsafe raw query API", /\$queryRawUnsafe|sequelize\.query\s*\(\s*(?:req|request|input|params|query|body)/i, "An unsafe raw query helper is present.", "Switch to parameterized query helpers and keep raw SQL inputs static.", 88);
  addRegexFinding("ssrf.dynamic-fetch", "high", "Server-side request forgery risk", /\b(?:fetch|axios\.(?:get|post|request)|got|request)\s*\(\s*(?:req|request|ctx|event|input|params|query|body)\./i, "A server-side request appears to target a user-provided URL.", "Validate protocol/host against an allowlist and block internal network ranges.", 82);
  addRegexFinding("path.traversal", "medium", "Filesystem path traversal risk", /\b(?:readFile|readFileSync|createReadStream|writeFile|writeFileSync|unlink|readdir)\s*\(\s*(?:req|request|ctx|event|input|params|query|body)\./i, "Filesystem access appears to use request-controlled paths.", "Normalize paths and enforce a fixed base directory allowlist.", 80);
  addRegexFinding("xss.dangerously-set-html", "medium", "Unsafe HTML injection sink", /dangerouslySetInnerHTML|\.innerHTML\s*=|document\.write\s*\(/i, "The code uses a browser HTML injection sink.", "Sanitize trusted HTML with a proven sanitizer and avoid raw HTML sinks for user content.", 76);
  addRegexFinding("auth.jwt-decode-only", "high", "JWT decoded without verification", /\bjwt\.decode\s*\(/i, "JWT decode does not verify the signature or claims.", "Use jwt.verify with issuer/audience/expiry validation.", 86);
  addRegexFinding("auth.weak-jwt-secret", "high", "Weak JWT signing secret", /\bjwt\.(?:sign|verify)\s*\([^,]+,\s*["'`](?:secret|password|changeme|test|dev)["'`]/i, "JWT signing/verifying uses an obvious static secret.", "Load a high-entropy secret from secure runtime configuration.", 86);
  addRegexFinding("crypto.weak-hash", "medium", "Weak cryptographic hash", /createHash\s*\(\s*["'`](?:md5|sha1)["'`]|hashlib\.(?:md5|sha1)\s*\(/i, "Weak hashes are present in security-sensitive-looking code.", "Use SHA-256+ for integrity or Argon2/bcrypt/scrypt for passwords.", 78);
  addRegexFinding("crypto.random-token", "high", "Insecure random token generation", /Math\.random\(\).{0,80}(?:token|secret|password|nonce|session)|(?:token|secret|password|nonce|session).{0,80}Math\.random\(\)/i, "Math.random appears near token or secret generation.", "Use crypto.getRandomValues, crypto.randomUUID, or crypto.randomBytes.", 82);
  addRegexFinding("cors.wildcard-credentials", "high", "Wildcard CORS with credentials", /origin\s*:\s*["'`]\*["'`][\s\S]{0,160}credentials\s*:\s*true|Access-Control-Allow-Origin["'`]?\s*[:,]\s*["'`]\*["'`][\s\S]{0,160}Access-Control-Allow-Credentials["'`]?\s*[:,]\s*["'`]true/i, "CORS appears to allow any origin while credentials are enabled.", "Use a strict origin allowlist and avoid wildcard credentialed CORS.", 86);
  addRegexFinding("cors.wildcard", "medium", "Wildcard CORS policy", /Access-Control-Allow-Origin["'`]?\s*[:,]\s*["'`]\*["'`]|origin\s*:\s*["'`]\*["'`]/i, "Wildcard CORS is present.", "Prefer explicit allowed origins, especially for authenticated APIs.", 74, 5);
  addRegexFinding("python.deserialization", "high", "Unsafe Python deserialization", /\bpickle\.loads?\s*\(|yaml\.load\s*\([^)]*(?:Loader\s*=\s*yaml\.Loader|Loader\s*=\s*Loader)?/i, "Unsafe deserialization APIs can execute attacker-controlled payloads.", "Use safe_load or a structured data format without executable objects.", 84);
  addRegexFinding("solidity.tx-origin", "high", "Smart contract tx.origin authorization", /\btx\.origin\b/i, "tx.origin is unsafe for authorization in smart contracts.", "Use msg.sender and explicit access control patterns.", 88);
  addRegexFinding("solidity.delegatecall", "medium", "Smart contract delegatecall risk", /\bdelegatecall\b/i, "delegatecall can corrupt storage or execute attacker-controlled logic.", "Restrict targets and document upgrade/proxy trust boundaries.", 76);

  for (const file of files.filter((candidate) => basename(candidate.name).toLowerCase() === "dockerfile")) {
    const lower = file.content.toLowerCase();
    if (/^from\s+\S+:latest\b/im.test(file.content)) {
      addFinding({
        ruleId: "docker.latest-tag",
        severity: "medium",
        title: "Docker image uses latest tag",
        detail: "The Dockerfile uses a floating latest tag, which weakens reproducibility and patch review.",
        file: sanitizeFileName(file),
        line: lineNumberForIndex(file.content, file.content.search(/^from\s+\S+:latest\b/im)),
        recommendation: "Pin base images to a supported version or digest.",
        confidence: 82,
      });
    }
    if (!/^user\s+\S+/im.test(file.content)) {
      addFinding({
        ruleId: "docker.root-user",
        severity: "medium",
        title: "Container may run as root",
        detail: "No non-root USER instruction was found in the Dockerfile.",
        file: sanitizeFileName(file),
        recommendation: "Create and switch to a non-root runtime user.",
        confidence: 78,
      });
    }
    if (/\b(?:env|arg)\s+(?:api[_-]?key|secret|token|password)=/i.test(lower)) {
      addFinding({
        ruleId: "docker.secret-env",
        severity: "high",
        title: "Secret-like Docker build variable",
        detail: "A Docker ENV/ARG name looks like it may carry secret material.",
        file: sanitizeFileName(file),
        recommendation: "Do not bake secrets into images; inject them at runtime through platform secrets.",
        confidence: 80,
      });
    }
  }

  for (const file of files.filter((candidate) => normalizePath(candidate.name).toLowerCase().includes(".github/workflows/"))) {
    if (/pull_request_target\s*:/i.test(file.content)) {
      addFinding({
        ruleId: "gha.pull-request-target",
        severity: "high",
        title: "Dangerous pull_request_target workflow",
        detail: "pull_request_target can expose privileged tokens to untrusted pull request code when misused.",
        file: sanitizeFileName(file),
        recommendation: "Use pull_request for untrusted code, or strictly separate checkout and privileged steps.",
        confidence: 82,
      });
    }
    if (/uses:\s*[^@\s]+\/[^@\s]+@(main|master|v\d+)\b/i.test(file.content)) {
      addFinding({
        ruleId: "gha.unpinned-action",
        severity: "low",
        title: "GitHub Action not pinned to commit SHA",
        detail: "A workflow action is pinned to a mutable branch or broad version tag.",
        file: sanitizeFileName(file),
        recommendation: "Pin third-party actions to immutable commit SHAs and review updates intentionally.",
        confidence: 72,
      });
    }
  }

  const counts = severityCounts(findings);
  const score = clamp(100 - counts.critical * 30 - counts.high * 17 - counts.medium * 8 - counts.low * 3);
  return { findings, counts, score };
}

function parsePackageJson(file: FileSignal) {
  try {
    return JSON.parse(file.content) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      optionalDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
      scripts?: Record<string, string>;
      packageManager?: string;
    };
  } catch {
    return null;
  }
}

function normalizeVersionRange(version: string) {
  const cleaned = version.trim().replace(/^[~^=v\s]+/, "");
  const match = cleaned.match(/\d+(?:\.\d+){0,3}(?:[-+][0-9A-Za-z.-]+)?/);
  return match?.[0];
}

function parseRequirementLine(line: string) {
  const clean = line.split("#")[0]?.trim() || "";
  if (!clean || clean.startsWith("-")) return null;
  const match = clean.match(/^([A-Za-z0-9_.-]+)\s*(?:==|===|~=|>=|<=|>|<)?\s*([A-Za-z0-9_.!+\-]+)?/);
  if (!match?.[1]) return null;
  return { name: match[1], version: match[2] };
}

export function collectDependencyQueries(files: FileSignal[], limit = 80): DependencyQuery[] {
  const queries: DependencyQuery[] = [];
  const seen = new Set<string>();
  const add = (query: DependencyQuery) => {
    if (queries.length >= limit) return;
    const key = `${query.ecosystem}:${query.packageName}:${query.version || ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    queries.push(query);
  };

  for (const file of files) {
    const name = basename(file.name).toLowerCase();
    if (name === "package.json") {
      const parsed = parsePackageJson(file);
      if (!parsed) continue;
      const allDeps = {
        ...(parsed.dependencies || {}),
        ...(parsed.devDependencies || {}),
        ...(parsed.optionalDependencies || {}),
        ...(parsed.peerDependencies || {}),
      };
      for (const [packageName, versionRange] of Object.entries(allDeps)) {
        add({ ecosystem: "npm", packageName, version: normalizeVersionRange(versionRange), manifest: file.name });
      }
    }

    if (name === "requirements.txt") {
      for (const line of file.content.split(/\r?\n/)) {
        const parsed = parseRequirementLine(line);
        if (parsed) add({ ecosystem: "PyPI", packageName: parsed.name, version: parsed.version, manifest: file.name });
      }
    }

    if (name === "cargo.toml") {
      for (const match of file.content.matchAll(/^\s*([A-Za-z0-9_-]+)\s*=\s*["']([^"']+)["']/gm)) {
        add({ ecosystem: "crates.io", packageName: match[1], version: normalizeVersionRange(match[2]), manifest: file.name });
      }
    }

    if (name === "go.mod") {
      for (const match of file.content.matchAll(/^\s*([A-Za-z0-9_.\-\/]+)\s+v?([0-9][^\s]*)/gm)) {
        add({ ecosystem: "Go", packageName: match[1], version: match[2], manifest: file.name });
      }
    }

    if (name === "composer.json") {
      try {
        const parsed = JSON.parse(file.content) as { require?: Record<string, string>; "require-dev"?: Record<string, string> };
        for (const [packageName, versionRange] of Object.entries({ ...(parsed.require || {}), ...(parsed["require-dev"] || {}) })) {
          if (packageName === "php") continue;
          add({ ecosystem: "Packagist", packageName, version: normalizeVersionRange(versionRange), manifest: file.name });
        }
      } catch {
        // Local heuristic parser only.
      }
    }
  }

  return queries;
}

function buildDependencyAudit(files: FileSignal[], fileSignals: FileSignals, externalSignals: ExternalDependencySignal[] = []) {
  const risks: DependencyRisk[] = [];
  const addRisk = (risk: DependencyRisk) => {
    if (risks.length >= 90) return;
    const key = `${risk.ecosystem}:${risk.packageName || ""}:${risk.title}`;
    if (!risks.some((existing) => `${existing.ecosystem}:${existing.packageName || ""}:${existing.title}` === key)) risks.push(risk);
  };

  for (const signal of externalSignals) {
    addRisk({
      title: signal.title,
      detail: signal.detail,
      severity: signal.severity,
      ecosystem: signal.ecosystem,
      packageName: signal.packageName,
      version: signal.version,
      source: signal.source,
      recommendation: signal.recommendation,
    });
  }

  const packageFiles = files.filter((file) => basename(file.name).toLowerCase() === "package.json");
  const deprecatedNpm: Record<string, Severity> = {
    request: "medium",
    "node-sass": "medium",
    "babel-eslint": "low",
    "left-pad": "low",
    "event-stream": "high",
    "flatmap-stream": "high",
    "serialize-javascript": "medium",
  };

  for (const file of packageFiles) {
    const parsed = parsePackageJson(file);
    if (!parsed) {
      addRisk({ title: "Invalid package.json", detail: `${file.name} could not be parsed.`, severity: "medium", ecosystem: "npm", recommendation: "Fix package metadata so dependency and script audits can run." });
      continue;
    }

    const allDeps = {
      ...(parsed.dependencies || {}),
      ...(parsed.devDependencies || {}),
      ...(parsed.optionalDependencies || {}),
      ...(parsed.peerDependencies || {}),
    };

    for (const [packageName, version] of Object.entries(allDeps)) {
      if (/^\s*(\*|latest|x)\s*$/i.test(version)) {
        addRisk({ title: "Unpinned npm dependency", detail: `${packageName} uses a floating version range.`, severity: "medium", ecosystem: "npm", packageName, source: "heuristic", recommendation: "Pin to a reviewed semver range or lockfile-backed version." });
      }
      if (/^(git\+)?https?:\/\//i.test(version)) {
        addRisk({ title: "Remote dependency source", detail: `${packageName} is installed from a URL instead of a registry version.`, severity: "medium", ecosystem: "npm", packageName, source: "heuristic", recommendation: "Prefer registry versions or pin remote dependencies to immutable commits." });
      }
      const deprecatedSeverity = deprecatedNpm[packageName];
      if (deprecatedSeverity) {
        addRisk({ title: "Deprecated or historically risky package", detail: `${packageName} is known for maintenance or supply-chain risk.`, severity: deprecatedSeverity, ecosystem: "npm", packageName, source: "heuristic", recommendation: "Replace it with a maintained alternative and review transitive usage." });
      }
    }

    if (Object.keys(allDeps).length > 0 && !fileSignals.hasLockfile) {
      addRisk({ title: "Missing JavaScript lockfile", detail: "Dependencies are declared but no package lockfile was scanned.", severity: "medium", ecosystem: "npm", source: "heuristic", recommendation: "Commit a package-lock, pnpm-lock, yarn.lock, or bun lockfile for reproducible installs." });
    }

    for (const [scriptName, script] of Object.entries(parsed.scripts || {})) {
      if (/curl\s+[^|]+\|\s*(?:sh|bash)|wget\s+[^|]+\|\s*(?:sh|bash)/i.test(script)) {
        addRisk({ title: "Install script pipes network code into shell", detail: `${scriptName} downloads and executes remote shell content.`, severity: "high", ecosystem: "npm", source: "heuristic", recommendation: "Vendor or checksum the installer and avoid pipe-to-shell execution." });
      }
      if (/^(preinstall|install|postinstall|prepare)$/.test(scriptName) && !/husky|patch-package|prisma|esbuild|playwright/i.test(script)) {
        addRisk({ title: "Lifecycle install script", detail: `${scriptName} runs automatically during dependency installation.`, severity: "low", ecosystem: "npm", source: "heuristic", recommendation: "Keep install-time scripts minimal, documented, and reviewed." });
      }
    }

    if (!parsed.packageManager && Object.keys(allDeps).length > 0) {
      addRisk({ title: "Package manager not declared", detail: "packageManager is missing from package.json.", severity: "low", ecosystem: "npm", source: "heuristic", recommendation: "Declare packageManager to reduce install drift across machines." });
    }
  }

  for (const file of files.filter((candidate) => basename(candidate.name).toLowerCase() === "requirements.txt")) {
    const lines = file.content.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
    for (const line of lines.slice(0, 80)) {
      if (!/[=<>~!]=/.test(line) && !/^-/.test(line)) {
        addRisk({ title: "Unpinned Python dependency", detail: `${line} is not version constrained.`, severity: "medium", ecosystem: "python", packageName: line.split(/[<>=~!]/)[0], source: "heuristic", recommendation: "Pin or constrain Python packages and keep a lockfile for deployments." });
      }
      if (/^(django|flask|pyyaml|requests)\s*[<~]=?\s*[0-2]\./i.test(line)) {
        addRisk({ title: "Potentially old Python framework/library", detail: `${line} may represent an outdated dependency line.`, severity: "medium", ecosystem: "python", packageName: line.split(/[<>=~!]/)[0], source: "heuristic", recommendation: "Upgrade to a supported release and check advisories." });
      }
    }
  }

  for (const file of files.filter((candidate) => ["cargo.toml", "go.mod", "composer.json", "gemfile"].includes(basename(candidate.name).toLowerCase()))) {
    if (/\*\s*(?:$|["'])/m.test(file.content)) {
      addRisk({ title: "Wildcard dependency version", detail: `${file.name} contains a wildcard dependency version.`, severity: "medium", ecosystem: basename(file.name), source: "heuristic", recommendation: "Pin dependencies to reviewed versions or semver ranges." });
    }
  }

  const counts = severityCounts(risks);
  const score = clamp(100 - counts.critical * 25 - counts.high * 15 - counts.medium * 8 - counts.low * 3 - (packageFiles.length > 0 && !fileSignals.hasLockfile ? 8 : 0));
  return { risks, counts, score };
}

function buildArchitectureAudit(files: FileSignal[], fileSignals: FileSignals, securityScore: number, dependencyScore: number) {
  const sourceFiles = files.filter(isSourceFile);
  const sourceLineCounts = sourceFiles.map((file) => file.content.split(/\r?\n/).length);
  const totalSourceLines = sourceLineCounts.reduce((sum, count) => sum + count, 0);
  const longFiles = sourceFiles.filter((file) => file.content.split(/\r?\n/).length > 420);
  const veryLongFiles = sourceFiles.filter((file) => file.content.split(/\r?\n/).length > 850);
  const allContent = files.map((file) => `${file.name}\n${file.content}`).join("\n");
  const todoCount = (allContent.match(/\b(?:todo|fixme|hack|xxx)\b/gi) || []).length;
  const eslintDisableCount = (allContent.match(/eslint-disable|ts-ignore|type:\s*ignore|noqa/gi) || []).length;
  const anyCount = (allContent.match(/:\s*any\b|\bas\s+any\b|Any\b/g) || []).length;
  const consoleCount = (allContent.match(/\bconsole\.(?:log|debug|error|warn)\s*\(/g) || []).length;
  const emptyCatchCount = (allContent.match(/catch\s*(?:\([^)]*\))?\s*{\s*}/g) || []).length;
  const hasLayeredDirs = sourceFiles.some((file) => /(^|\/)(controllers?|routes?|services?|repositories?|models?|domain|infra|middleware|components|hooks|utils|lib)\//i.test(normalizePath(file.name)));
  const hasStrictTs = files.some((file) => basename(file.name).toLowerCase() === "tsconfig.json" && /"strict"\s*:\s*true/i.test(file.content));
  const hasErrorHandling = /try\s*{|catch\s*(?:\(|{)|Result<|Option<|\bexcept\b|\braise\b|panic!/i.test(allContent);
  const hasObservability = /logger|winston|pino|sentry|opentelemetry|prometheus|console\.error|tracing/i.test(allContent);
  const hasHealthcheck = /healthcheck|\/health|readiness|liveness/i.test(allContent);

  const maintainability = clamp(
    68
    + (hasLayeredDirs ? 8 : 0)
    + (hasStrictTs ? 6 : 0)
    + (fileSignals.hasLint ? 8 : 0)
    + (fileSignals.hasValidation ? 5 : 0)
    - longFiles.length * 4
    - veryLongFiles.length * 8
    - Math.min(anyCount, 30) * 0.7
    - Math.min(eslintDisableCount, 20) * 1.2
    - Math.min(emptyCatchCount, 10) * 3
    - Math.min(todoCount, 40) * 0.25,
  );

  const architecture = clamp(
    52
    + Math.min(sourceFiles.length, 20) * 1.1
    + (hasLayeredDirs ? 10 : 0)
    + (fileSignals.hasConfig ? 5 : 0)
    + (fileSignals.hasValidation ? 6 : 0)
    + (hasErrorHandling ? 5 : 0)
    - longFiles.length * 3
    - veryLongFiles.length * 6
    - (fileSignals.sourceFileCount === 0 ? 16 : 0),
  );

  const testing = clamp(
    28
    + (fileSignals.hasTests ? 24 : 0)
    + Math.min(fileSignals.testFileCount, 8) * 4
    + (fileSignals.hasCI ? 10 : 0)
    + (/coverage|nyc|c8|pytest-cov|jacoco|lcov/i.test(allContent) ? 12 : 0)
    + (fileSignals.hasBuild ? 4 : 0),
  );

  const modernity = clamp(
    48
    + (fileSignals.hasLint ? 8 : 0)
    + (hasStrictTs ? 8 : 0)
    + (fileSignals.hasValidation ? 7 : 0)
    + (fileSignals.hasDocker ? 5 : 0)
    + (/vite|next|react|svelte|astro|fastify|hono|elysia|rust|tokio|go 1\.(?:2[0-9]|1[8-9])|ruff|uv|bun|pnpm/i.test(allContent) ? 11 : 0)
    + dependencyScore * 0.08
    - Math.min(eslintDisableCount, 20),
  );

  const production = clamp(
    32
    + (fileSignals.hasCI ? 15 : 0)
    + (fileSignals.hasDocker ? 12 : 0)
    + (fileSignals.hasBuild ? 8 : 0)
    + (fileSignals.hasEnvExample ? 7 : 0)
    + (fileSignals.hasSecurity ? 7 : 0)
    + (fileSignals.hasRateLimit ? 6 : 0)
    + (hasObservability ? 6 : 0)
    + (hasHealthcheck ? 5 : 0)
    + securityScore * 0.08
    + dependencyScore * 0.06,
  );

  const architectureFindings: InsightItem[] = [
    hasLayeredDirs ? { title: "Layering signal present", detail: "The scanned paths suggest separated routes/services/components or domain modules.", impact: "Low" } : { title: "Layering not obvious", detail: "The scanned files do not clearly show separated modules for routing, business logic, persistence, and shared utilities.", impact: "Medium" },
    fileSignals.hasValidation ? { title: "Input validation signal present", detail: "A validation library or validation convention was detected.", impact: "Low" } : { title: "Validation boundary missing", detail: "No clear validation library or boundary pattern was detected in scanned evidence.", impact: "High" },
    hasErrorHandling ? { title: "Error handling visible", detail: "The code has explicit exception/result handling signals.", impact: "Low" } : { title: "Error handling not visible", detail: "Scanned evidence did not show meaningful error handling patterns.", impact: "Medium" },
  ];

  const codeSmellCandidates: Array<InsightItem | null> = [
    longFiles.length > 0 ? { title: "Large files detected", detail: `${longFiles.length} scanned source file(s) exceed 420 lines, which can hide responsibilities and review risk.`, impact: longFiles.length > 2 ? "High" : "Medium" } : null,
    anyCount > 6 ? { title: "Loose typing detected", detail: `${anyCount} loose typing markers were found across scanned files.`, impact: "Medium" } : null,
    eslintDisableCount > 3 ? { title: "Quality gates bypassed", detail: `${eslintDisableCount} lint/type suppression marker(s) were found.`, impact: "Medium" } : null,
    emptyCatchCount > 0 ? { title: "Swallowed errors", detail: `${emptyCatchCount} empty catch block(s) were found.`, impact: "High" } : null,
    consoleCount > 12 ? { title: "Console logging noise", detail: `${consoleCount} console logging call(s) were found in scanned files.`, impact: "Low" } : null,
    todoCount > 12 ? { title: "High unresolved marker count", detail: `${todoCount} TODO/FIXME/HACK marker(s) were found.`, impact: "Low" } : null,
  ];
  const codeSmells = codeSmellCandidates.filter((item): item is InsightItem => Boolean(item));

  const testQuality = {
    score: testing,
    evidence: [
      fileSignals.hasTests ? `${fileSignals.testFileCount || "Script-level"} test signal detected` : "No test signal detected",
      fileSignals.hasCI ? "CI can run automated checks" : "No CI workflow scanned",
      /coverage|nyc|c8|pytest-cov|jacoco|lcov/i.test(allContent) ? "Coverage tooling visible" : "Coverage tooling not obvious",
    ],
    gaps: [
      !fileSignals.hasTests ? "Add unit/integration tests around core behavior." : "",
      !fileSignals.hasCI ? "Run tests and type/lint checks in CI." : "",
      !/coverage|nyc|c8|pytest-cov|jacoco|lcov/i.test(allContent) ? "Expose coverage command or report." : "",
    ].filter(Boolean),
  };

  const productionReadiness = {
    score: production,
    evidence: [
      fileSignals.hasBuild ? "Build command visible" : "No build command scanned",
      fileSignals.hasDocker ? "Containerization visible" : "No containerization scanned",
      fileSignals.hasEnvExample ? "Environment configuration pattern visible" : "Environment setup not obvious",
      hasObservability ? "Logging/observability signal visible" : "Observability not obvious",
    ],
    blockers: [
      securityScore < 70 ? "Security findings block production confidence." : "",
      dependencyScore < 75 ? "Dependency hygiene needs review before production." : "",
      !fileSignals.hasCI ? "CI is missing or not scanned." : "",
      !fileSignals.hasEnvExample ? "Runtime configuration contract is unclear." : "",
    ].filter(Boolean),
  };

  return {
    architecture,
    maintainability,
    testing,
    modernity,
    production,
    architectureFindings,
    codeSmells,
    testQuality,
    productionReadiness,
    stats: {
      totalSourceLines,
      sourceFiles: sourceFiles.length,
      longFiles: longFiles.length,
      veryLongFiles: veryLongFiles.length,
      anyCount,
      eslintDisableCount,
      todoCount,
      emptyCatchCount,
    },
  };
}

function evidenceSummary(files: FileSignal[]): EvidenceSummary {
  const bytesScanned = files.reduce((sum, file) => sum + file.content.length, 0);
  return {
    filesScanned: files.length,
    sourceFilesScanned: files.filter(isSourceFile).length,
    configFilesScanned: files.filter((file) => isConfigFileName(normalizePath(file.name).toLowerCase())).length,
    bytesScanned,
    truncated: files.length >= 28 || bytesScanned > 600_000,
  };
}

function buildRoleFits(languages: ParsedLanguage[], metrics: AnalysisMetrics, trackSignals: TrackSignal[]) {
  return ROLE_PROFILES.map((profile) => {
    const languageScore = languages.filter((language) => profile.languages.includes(language.name)).reduce((sum, language) => sum + language.pct, 0);
    const trackScore = trackSignals.find((track) => track.name === profile.track)?.score || 0;
    const score = clamp(trackScore * 0.42 + languageScore * 0.20 + (metrics.Logic || 0) * 0.14 + (metrics.Security || 50) * 0.1 + (metrics.Production || 50) * 0.08 + (metrics.Popularity || 0) * 0.06);
    return {
      role: profile.role,
      score,
      matched: [
        `${profile.track} track ${trackScore}/100`,
        ...languages.filter((language) => profile.languages.includes(language.name)).slice(0, 3).map((language) => `${language.name} ${language.pct}%`),
        (metrics.Security || 0) >= 80 ? "Strong security hygiene" : "",
      ].filter(Boolean),
      gaps: [
        score < 55 ? `Build one polished ${profile.track.toLowerCase()} project` : "",
        (metrics.Testing || 0) < 65 ? "Add stronger test and CI proof" : "",
        (metrics.Security || 0) < 75 ? "Close security findings before claiming production maturity" : "",
        (metrics.Documentation || 0) < 65 ? "Improve README, examples, screenshots, and setup proof" : "",
      ].filter(Boolean),
    };
  }).sort((a, b) => b.score - a.score);
}

function toInsightFromFinding(finding: SecurityFinding): InsightItem {
  const location = finding.file ? `${finding.file}${finding.line ? `:${finding.line}` : ""}` : "scanned evidence";
  return {
    title: finding.title,
    detail: `${finding.detail} Location: ${location}. Fix: ${finding.recommendation}`,
    impact: severityImpact(finding.severity),
  };
}

function toInsightFromDependency(risk: DependencyRisk): InsightItem {
  return {
    title: risk.title,
    detail: `${risk.detail} Fix: ${risk.recommendation}`,
    impact: severityImpact(risk.severity),
  };
}

export function buildAdvancedAnalysis(params: {
  kind: "dev" | "repo";
  devIq: number;
  repoCount: number;
  languages: ParsedLanguage[];
  files: FileSignal[];
  externalSignals?: ExternalAnalysisSignals;
  deepAnalysis?: {
    summary: string;
    architecture: string;
    modernity: string;
    security: string;
    scalability: string;
    remarks: Array<{ topic: string; remark: string }>;
  } | undefined;
}): AdvancedAnalysis {
  const fileSignals = analyzeFileSignals(params.files);
  const securityAudit = buildSecurityAudit(params.files);
  const externalDependencySignals = params.externalSignals?.dependencySignals || [];
  const externalRepoSignals = params.externalSignals?.repoSignals || [];
  const repoSignalCounts = severityCounts(externalRepoSignals);
  const dependencyAudit = buildDependencyAudit(params.files, fileSignals, externalDependencySignals);
  const securityScoreWithExternal = clamp(securityAudit.score - repoSignalCounts.critical * 18 - repoSignalCounts.high * 10 - repoSignalCounts.medium * 4 - repoSignalCounts.low);
  const dependencyScoreWithExternal = dependencyAudit.score;
  const architectureAudit = buildArchitectureAudit(params.files, fileSignals, securityScoreWithExternal, dependencyScoreWithExternal);
  const trackSignals = buildTrackSignals(params.languages, fileSignals, params.repoCount, params.devIq);
  const primaryTrack = trackSignals[0] || { name: "General Software", score: 45, evidence: ["Insufficient evidence"] };
  const scale = clamp(devIqSignal(params.devIq) * 0.82 + Math.min(params.repoCount, 35) * (params.kind === "dev" ? 1.25 : 0.25));
  const complexity = complexitySignal(params.languages);
  const focus = focusSignal(params.languages);
  const breadth = clamp(48 + Math.min(params.languages.filter((language) => language.pct >= 5).length, 6) * 7 + Math.min(params.repoCount, 16) * 0.6);
  const quality = clamp(
    20
    + (fileSignals.hasTests ? 10 : 0)
    + (fileSignals.hasCI ? 10 : 0)
    + (fileSignals.hasBuild ? 7 : 0)
    + (fileSignals.hasLint ? 7 : 0)
    + (fileSignals.hasDocker ? 5 : 0)
    + (fileSignals.hasSecurity ? 5 : 0)
    + securityAudit.score * 0.18
    + dependencyAudit.score * 0.1
    + architectureAudit.maintainability * 0.1,
  );
  const presentation = clamp(
    30
    + Math.min(fileSignals.readmeLength / 75, 24)
    + (fileSignals.hasExamples ? 10 : 0)
    + (fileSignals.hasConfig ? 6 : 0)
    + (fileSignals.hasBuild ? 5 : 0)
    + (fileSignals.hasSecurity ? 5 : 0)
    + Math.min(params.repoCount, 18) * 0.75,
  );

  const metrics: AnalysisMetrics = {
    Logic: clamp(primaryTrack.score * 0.25 + scale * 0.16 + complexity * 0.18 + focus * 0.07 + quality * 0.22 + fileSignals.toolingRigor * 0.55),
    Documentation: presentation,
    Versatility: clamp(primaryTrack.name === "Full Stack Product" ? breadth + 14 : breadth + Math.min(trackSignals[1]?.score || 0, 60) * 0.12),
    Popularity: clamp(scale + (params.devIq > 1_000_000 ? 10 : 0) + (fileSignals.hasExamples ? 5 : 0)),
    Security: securityScoreWithExternal,
    Architecture: architectureAudit.architecture,
    Modernity: architectureAudit.modernity,
    Testing: architectureAudit.testing,
    Dependencies: dependencyAudit.score,
    Maintainability: architectureAudit.maintainability,
    Production: architectureAudit.production,
  };

  const totalSeverityCounts = {
    critical: securityAudit.counts.critical + repoSignalCounts.critical,
    high: securityAudit.counts.high + repoSignalCounts.high,
    medium: securityAudit.counts.medium + repoSignalCounts.medium,
    low: securityAudit.counts.low + repoSignalCounts.low,
  };
  const severityPenalty = totalSeverityCounts.critical * 9 + totalSeverityCounts.high * 5 + dependencyAudit.counts.high * 3;
  const algorithmicScore = clamp(
    metrics.Logic * 0.15
    + metrics.Security! * 0.17
    + metrics.Architecture! * 0.13
    + metrics.Maintainability! * 0.11
    + metrics.Testing! * 0.10
    + metrics.Dependencies! * 0.10
    + metrics.Production! * 0.10
    + metrics.Documentation * 0.06
    + metrics.Popularity * 0.04
    + metrics.Versatility * 0.04
    - severityPenalty,
  );

  const roleFits = buildRoleFits(params.languages, metrics, trackSignals);
  const categories: HealthCategory[] = [
    { label: "Security", score: metrics.Security!, evidence: `${totalSeverityCounts.critical} critical, ${totalSeverityCounts.high} high, ${totalSeverityCounts.medium} medium findings across local + API evidence.` },
    { label: "Architecture", score: metrics.Architecture!, evidence: `${architectureAudit.stats.sourceFiles} source files, ${architectureAudit.stats.longFiles} long files, validation ${fileSignals.hasValidation ? "present" : "not obvious"}.` },
    { label: "Dependencies", score: metrics.Dependencies!, evidence: `${dependencyAudit.risks.length} dependency risk(s), ${externalDependencySignals.length} API-backed, lockfile ${fileSignals.hasLockfile ? "present" : "not obvious"}.` },
    { label: "Testing", score: metrics.Testing!, evidence: `${fileSignals.testFileCount} test file(s), test signal ${fileSignals.hasTests ? "present" : "missing"}, CI ${fileSignals.hasCI ? "present" : "missing"}.` },
    { label: "Production", score: metrics.Production!, evidence: `Docker ${fileSignals.hasDocker ? "yes" : "no"}, env contract ${fileSignals.hasEnvExample ? "yes" : "no"}, rate limit ${fileSignals.hasRateLimit ? "yes" : "no"}.` },
    { label: "Track Fit", score: primaryTrack.score, evidence: `${primaryTrack.name}: ${primaryTrack.evidence.join(" | ")}` },
  ];
  const blockers = [
    securityAudit.counts.critical > 0 ? "Critical security finding present." : "",
    securityAudit.counts.high > 0 ? "High severity security finding present." : "",
    repoSignalCounts.critical > 0 ? "Critical API-backed repository/security signal present." : "",
    repoSignalCounts.high > 0 ? "High API-backed repository/security signal present." : "",
    dependencyAudit.counts.high > 0 ? "High severity dependency/supply-chain risk present." : "",
    !fileSignals.hasTests ? "No clear testing signal." : "",
    !fileSignals.hasCI ? "No CI signal in inspected files." : "",
    metrics.Documentation < 58 ? "Public presentation is weak." : "",
    primaryTrack.score < 45 ? "Unclear project archetype." : "",
  ].filter(Boolean);

  const securityInsights = securityAudit.findings.slice(0, 6).map(toInsightFromFinding);
  const dependencyInsights = dependencyAudit.risks.slice(0, 4).map(toInsightFromDependency);
  const externalRepoInsights = externalRepoSignals.slice(0, 4).map((signal) => ({
    title: signal.title,
    detail: `${signal.detail} Fix: ${signal.recommendation}`,
    impact: severityImpact(signal.severity),
  }));
  const roadmapItems: Array<InsightItem | null> = [
    totalSeverityCounts.critical > 0 || totalSeverityCounts.high > 0 ? { title: "Fix security blockers first", detail: "Critical/high security findings outweigh popularity or language complexity in the strict score.", impact: "High" } : null,
    dependencyAudit.risks.length > 0 ? { title: "Harden dependencies", detail: "Pin dependency versions, commit lockfiles, and replace risky packages/scripts.", impact: dependencyAudit.counts.high > 0 ? "High" : "Medium" } : null,
    !fileSignals.hasTests ? { title: "Add visible tests", detail: "Expose test scripts, test folders, or coverage notes around real behavior.", impact: "High" } : null,
    !fileSignals.hasCI ? { title: "Add CI quality gates", detail: "Run build, test, lint, and type checks on every pull request.", impact: "Medium" } : null,
    !fileSignals.hasValidation ? { title: "Add validation boundaries", detail: "Validate inputs at API, CLI, and file/network boundaries before business logic.", impact: "High" } : null,
    metrics.Documentation < 70 ? { title: "Improve project story", detail: "Add setup, screenshots, architecture notes, security notes, examples, and deployment instructions.", impact: "Medium" } : null,
  ];

  const confidenceBreakdown = [
    { label: "Files", score: clamp(params.files.length * 4), detail: `${params.files.length} high-signal files scanned.` },
    { label: "Source", score: clamp(fileSignals.sourceFileCount * 8), detail: `${fileSignals.sourceFileCount} source file(s) scanned.` },
    { label: "Config", score: clamp(fileSignals.configFileCount * 7), detail: `${fileSignals.configFileCount} config/metadata file(s) scanned.` },
    { label: "Tests", score: fileSignals.hasTests ? 85 : 35, detail: fileSignals.hasTests ? "Testing signal available." : "Testing signal missing." },
    { label: "Language", score: params.languages.length > 0 ? 85 : 30, detail: `${params.languages.length} language signal(s) from GitHub.` },
    { label: "External APIs", score: params.externalSignals?.sources.length ? 85 : 35, detail: `${params.externalSignals?.sources.join(", ") || "No external enrichment"} used.` },
  ];
  const confidence = clamp(confidenceBreakdown.reduce((sum, item) => sum + item.score, 0) / confidenceBreakdown.length);

  return {
    algorithmicScore,
    metrics,
    primaryTrack,
    trackSignals,
    languageDistribution: buildLanguageDistribution(params.languages),
    roleFits,
    codebaseHealth: { overall: clamp(categories.reduce((sum, category) => sum + category.score, 0) / categories.length), categories, blockers },
    roadmap: roadmapItems.filter((item): item is InsightItem => Boolean(item)).slice(0, 7),
    weaknessDetector: [
      ...securityInsights,
      ...externalRepoInsights,
      ...dependencyInsights,
      ...architectureAudit.codeSmells,
      ...blockers.map((blocker) => ({ title: blocker, detail: "This is a strict deterministic signal from scanned GitHub evidence.", impact: "Medium" as const })),
    ].slice(0, 12),
    contributionFingerprint: [
      { title: "Detected Track", detail: `${primaryTrack.name} with ${primaryTrack.score}/100 track confidence.` },
      { title: "Main Stack", detail: `${params.languages[0]?.name || "Unknown"} carries ${params.languages[0]?.pct || 0}% of visible code.` },
      { title: "Security Posture", detail: `${securityScoreWithExternal}/100 with ${securityAudit.findings.length + externalRepoSignals.length} local/API finding(s).` },
      { title: "Architecture Signal", detail: `${architectureAudit.architecture}/100 from ${architectureAudit.stats.sourceFiles} source file(s) and ${architectureAudit.stats.totalSourceLines} scanned lines.` },
      { title: "Scale", detail: `Dev IQ ${params.devIq.toLocaleString()} across ${params.repoCount} repo signal.` },
    ],
    timeline: [
      { label: "Evidence", detail: `${params.files.length} high-signal files were scanned for config, source, tests, and risk patterns.`, intensity: confidence },
      { label: "Security", detail: `Security score is ${securityScoreWithExternal}/100 from deterministic and API-backed evidence.`, intensity: securityScoreWithExternal },
      { label: "Quality", detail: `Testing ${architectureAudit.testing}/100 and maintainability ${architectureAudit.maintainability}/100.`, intensity: clamp((architectureAudit.testing + architectureAudit.maintainability) / 2) },
      { label: "Reach", detail: `Popularity signal is ${metrics.Popularity}/100.`, intensity: metrics.Popularity },
    ],
    confidence,
    securityScore: securityScoreWithExternal,
    vulnerabilities: securityAudit.findings,
    dependencyRisks: dependencyAudit.risks,
    architectureFindings: architectureAudit.architectureFindings,
    codeSmells: architectureAudit.codeSmells,
    testQuality: architectureAudit.testQuality,
    productionReadiness: architectureAudit.productionReadiness,
    confidenceBreakdown,
    severityCounts: totalSeverityCounts,
    evidenceSummary: evidenceSummary(params.files),
    externalSignals: params.externalSignals,
    deepAnalysis: params.deepAnalysis,
  };
}

export function buildDeepAnalysisReport(files: FileSignal[], metrics: AnalysisMetrics, primaryTrack: TrackSignal, advanced?: AdvancedAnalysis) {
  const securityScore = advanced?.securityScore ?? metrics.Security ?? 50;
  const criticalHigh = advanced ? advanced.severityCounts.critical + advanced.severityCounts.high : 0;
  const topFinding = advanced?.vulnerabilities[0];
  const sourceFiles = files.filter(isSourceFile).length;
  const configFiles = files.filter((file) => isConfigFileName(normalizePath(file.name).toLowerCase())).length;
  const topRiskText = topFinding ? `${topFinding.title} in ${topFinding.file || "scanned files"}` : "no critical/high security blocker in the scanned evidence";

  const summary = `Strict analysis scanned ${files.length} high-signal file(s), including ${sourceFiles} source and ${configFiles} config file(s). ${primaryTrack.name} is the strongest detected lane. Overall algorithmic score is ${advanced?.algorithmicScore ?? 0}/100, with security at ${securityScore}/100 and production readiness at ${metrics.Production ?? 50}/100.`;
  const architecture = advanced
    ? `Architecture scores ${metrics.Architecture ?? 0}/100. ${advanced.architectureFindings.map((item) => item.title).slice(0, 2).join(" | ") || "No strong architecture signal found."}`
    : `Architecture score is ${metrics.Architecture ?? 0}/100 from scanned source/config evidence.`;
  const modernity = `Modernity scores ${metrics.Modernity ?? 0}/100. The engine weighs typed config, validation, linting, current tooling, dependency hygiene, and quality-gate bypasses.`;
  const security = criticalHigh > 0
    ? `Security is strict-fail oriented: ${criticalHigh} critical/high issue(s) were found. Top issue: ${topRiskText}.`
    : `Security posture is ${securityScore >= 80 ? "strong in scanned evidence" : "acceptable but still limited by scanned evidence"}: ${topRiskText}.`;
  const scalability = advanced
    ? `Production readiness scores ${advanced.productionReadiness.score}/100. ${advanced.productionReadiness.evidence.join(" ")}`
    : `Production readiness scores ${metrics.Production ?? 0}/100 from CI, Docker, build, env, observability, and security signals.`;

  return {
    summary,
    architecture,
    modernity,
    security,
    scalability,
    remarks: [
      { topic: "Security", remark: advanced ? `${advanced.vulnerabilities.length} vulnerability pattern(s) detected; severity mix ${advanced.severityCounts.critical} critical, ${advanced.severityCounts.high} high, ${advanced.severityCounts.medium} medium, ${advanced.severityCounts.low} low.` : "Security details unavailable." },
      { topic: "Dependencies", remark: advanced ? `${advanced.dependencyRisks.length} dependency/supply-chain risk(s) detected. Dependency hygiene score: ${metrics.Dependencies ?? 0}/100.` : "Dependency details unavailable." },
      { topic: "Testing", remark: advanced ? `Testing score: ${advanced.testQuality.score}/100. ${advanced.testQuality.gaps[0] || "No major testing gap in scanned evidence."}` : "Testing details unavailable." },
      { topic: "Production", remark: advanced ? `Production blockers: ${advanced.productionReadiness.blockers.join(" | ") || "none from scanned evidence"}.` : "Production details unavailable." },
      { topic: "Confidence", remark: advanced ? `Confidence ${advanced.confidence}/100 from ${advanced.evidenceSummary.filesScanned} files and ${advanced.evidenceSummary.bytesScanned.toLocaleString()} scanned bytes.` : "Confidence details unavailable." },
    ],
  };
}
