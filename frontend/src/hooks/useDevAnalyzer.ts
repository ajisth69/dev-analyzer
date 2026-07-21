import { useState, useCallback } from 'react';

export interface AnalysisMetrics {
  Logic: number;
  Documentation: number;
  Versatility: number;
  Popularity: number;
  Architecture?: number;
  Modernity?: number;
  [key: string]: number | undefined;
}

export interface TrackSignal { name: string; score: number; evidence: string[]; }
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export interface SecurityFinding { ruleId: string; title: string; detail: string; severity: Severity; file?: string; line?: number; recommendation: string; confidence: number; }
export interface DependencyRisk { title: string; detail: string; severity: Severity; ecosystem: string; packageName?: string; version?: string; source?: 'heuristic' | 'osv' | 'deps.dev' | 'scorecard' | 'github'; recommendation: string; }
export interface DependencyQuery { ecosystem: string; packageName: string; version?: string; manifest: string; }
export interface ExternalDependencySignal { ecosystem: string; packageName: string; version?: string; vulnerabilityId?: string; title: string; detail: string; severity: Severity; source: 'osv' | 'deps.dev' | 'github'; recommendation: string; }
export interface ExternalRepoSignal { source: 'scorecard' | 'github'; title: string; detail: string; severity: Severity; score?: number; recommendation: string; }
export interface ExternalAnalysisSignals { dependencySignals: ExternalDependencySignal[]; repoSignals: ExternalRepoSignal[]; dependencyQueries: DependencyQuery[]; sources: string[]; }
export interface EvidenceSummary { filesScanned: number; sourceFilesScanned: number; configFilesScanned: number; bytesScanned: number; truncated: boolean; }

export interface AdvancedAnalysis {
  algorithmicScore: number;
  metrics: AnalysisMetrics;
  primaryTrack: TrackSignal;
  trackSignals: TrackSignal[];
  languageDistribution: Array<{ name: string; pct: number; color: string }>;
  roleFits: Array<{ role: string; score: number; matched: string[]; gaps: string[] }>;
  codebaseHealth: { overall: number; categories: Array<{ label: string; score: number; evidence: string }>; blockers: string[]; };
  roadmap: Array<{ title: string; detail: string; impact?: 'High' | 'Medium' | 'Low' }>;
  weaknessDetector: Array<{ title: string; detail: string; impact?: 'High' | 'Medium' | 'Low' }>;
  contributionFingerprint: Array<{ title: string; detail: string; impact?: 'High' | 'Medium' | 'Low' }>;
  timeline: Array<{ label: string; detail: string; intensity: number }>;
  confidence: number;
  securityScore?: number;
  vulnerabilities?: SecurityFinding[];
  dependencyRisks?: DependencyRisk[];
  architectureFindings?: Array<{ title: string; detail: string; impact?: 'High' | 'Medium' | 'Low' }>;
  codeSmells?: Array<{ title: string; detail: string; impact?: 'High' | 'Medium' | 'Low' }>;
  testQuality?: { score: number; evidence: string[]; gaps: string[] };
  productionReadiness?: { score: number; evidence: string[]; blockers: string[] };
  confidenceBreakdown?: Array<{ label: string; score: number; detail: string }>;
  severityCounts?: Record<Severity, number>;
  evidenceSummary?: EvidenceSummary;
  externalSignals?: ExternalAnalysisSignals;
  deepAnalysis?: { summary: string; architecture: string; modernity: string; security: string; scalability: string; remarks: Array<{ topic: string; remark: string }>; };
}

export interface SuggestedProject {
  title: string;
  difficulty: string;
  reason: string;
  impact: string;
}

export interface AIRepoAnalysis { repo_name: string; repo_score: number; verdict: string; }

export interface AnalyzerResponse {
  username: string;
  devIq: number;
  languageTags: string[];
  maturityAnalysis?: { summary: string; metrics: AnalysisMetrics; architecture: string; modernity: string; security: string; scalability: string; remarks: Array<{ topic: string; remark: string }>; };
  seniorityAnalysis?: { summary: string; metrics?: AnalysisMetrics; architecture?: string; modernity?: string; security?: string; scalability?: string; remarks?: Array<{ topic: string; remark: string }>; };
  analyzedReposCount: number;
  advancedAnalysis?: AdvancedAnalysis;
  ai_score?: number;
  ai_grade?: string;
  developer_role_title?: string;
  repo_archetype?: string;
  profile_verdict?: string;
  code_quality_verdict?: string;
  architecture_verdict?: string;
  security_verdict?: string;
  scalability_verdict?: string;
  documentation_verdict?: string;
  innovation_verdict?: string;
  community_verdict?: string;
  role_fit_verdict?: string;
  growth_verdict?: string;
  roast?: string;
  top_repos_analysis?: AIRepoAnalysis[];
  suggested_projects?: SuggestedProject[];
}

export interface RepoAnalysisResponse {
  owner: string;
  repoName: string;
  devIq: number;
  languageTags: string[];
  maturityAnalysis?: { summary: string; metrics: AnalysisMetrics; architecture: string; modernity: string; security: string; scalability: string; remarks: Array<{ topic: string; remark: string }>; };
  seniorityAnalysis?: { summary: string; metrics?: AnalysisMetrics; architecture?: string; modernity?: string; security?: string; scalability?: string; remarks?: Array<{ topic: string; remark: string }>; };
  advancedAnalysis?: AdvancedAnalysis;
  repoMeta?: { stars: number; forks: number; watchers: number; open_issues: number; description: string };
  ai_score?: number;
  ai_grade?: string;
  developer_role_title?: string;
  repo_archetype?: string;
  profile_verdict?: string;
  code_quality_verdict?: string;
  architecture_verdict?: string;
  security_verdict?: string;
  scalability_verdict?: string;
  documentation_verdict?: string;
  innovation_verdict?: string;
  community_verdict?: string;
  role_fit_verdict?: string;
  growth_verdict?: string;
  roast?: string;
  top_repos_analysis?: AIRepoAnalysis[];
  suggested_projects?: SuggestedProject[];
}

export interface CompareResponse { repo1: RepoAnalysisResponse; repo2: RepoAnalysisResponse; battle_report?: string; }
export interface CompareDevsResponse { dev1: AnalyzerResponse; dev2: AnalyzerResponse; battle_report?: string; }

const WORKER_URL = '/api/analyze';
const ANALYZE_REPO_URL = '/api/analyze-repo';
const COMPARE_URL = '/api/compare-repos';
const COMPARE_DEVS_URL = '/api/compare-devs';

export const DAILY_FREE_LIMIT = 3;

export function getDailyUsage(): { count: number; date: string } {
  const today = new Date().toISOString().split('T')[0];
  try {
    const raw = localStorage.getItem('dev_analyzer_daily_usage');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === today) return parsed;
    }
  } catch {}
  return { count: 0, date: today };
}

export function incrementDailyUsage() {
  const today = new Date().toISOString().split('T')[0];
  const current = getDailyUsage();
  const next = { count: current.date === today ? current.count + 1 : 1, date: today };
  try {
    localStorage.setItem('dev_analyzer_daily_usage', JSON.stringify(next));
  } catch {}
  return next;
}

export function getCustomGroqKey(): string {
  try {
    return localStorage.getItem('dev_analyzer_custom_groq_key') || '';
  } catch {
    return '';
  }
}

export function setCustomGroqKey(key: string) {
  try {
    if (key.trim()) {
      localStorage.setItem('dev_analyzer_custom_groq_key', key.trim());
    } else {
      localStorage.removeItem('dev_analyzer_custom_groq_key');
    }
  } catch {}
}

export function useDevAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzerResponse | null>(null);
  const [repoData, setRepoData] = useState<RepoAnalysisResponse | null>(null);
  const [compareData, setCompareData] = useState<CompareResponse | null>(null);
  const [compareDevsData, setCompareDevsData] = useState<CompareDevsResponse | null>(null);

  const clearAllData = () => { setData(null); setRepoData(null); setCompareData(null); setCompareDevsData(null); };

  const analyze = useCallback(async (username: string, customKey?: string) => {
    if (!username.trim()) return;
    setLoading(true); setError(null); clearAllData();
    const groqKey = customKey || getCustomGroqKey();
    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim().toLowerCase(), groqApiKey: groqKey || undefined }),
      });
      if (!response.ok) { const e = await response.json().catch(() => ({})); throw new Error((e as { error?: string }).error || `HTTP ${response.status}`); }
      const json = await response.json();
      incrementDailyUsage();
      setData(json);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed to analyze'); } finally { setLoading(false); }
  }, []);

  const analyzeRepo = useCallback(async (repo: string, customKey?: string) => {
    if (!repo.trim()) return;
    setLoading(true); setError(null); clearAllData();
    const groqKey = customKey || getCustomGroqKey();
    try {
      const response = await fetch(ANALYZE_REPO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repo.trim().toLowerCase(), groqApiKey: groqKey || undefined }),
      });
      if (!response.ok) { const e = await response.json().catch(() => ({})); throw new Error((e as { error?: string }).error || `HTTP ${response.status}`); }
      const json = await response.json();
      incrementDailyUsage();
      setRepoData(json);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed to analyze repo'); } finally { setLoading(false); }
  }, []);

  const compareRepos = useCallback(async (repo1: string, repo2: string, customKey?: string) => {
    if (!repo1.trim() || !repo2.trim()) return;
    setLoading(true); setError(null); clearAllData();
    const groqKey = customKey || getCustomGroqKey();
    try {
      const response = await fetch(COMPARE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo1: repo1.trim(), repo2: repo2.trim(), groqApiKey: groqKey || undefined }),
      });
      if (!response.ok) { const e = await response.json().catch(() => ({})); throw new Error((e as { error?: string }).error || `HTTP ${response.status}`); }
      const json = await response.json();
      incrementDailyUsage();
      setCompareData(json);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed to compare repos'); } finally { setLoading(false); }
  }, []);

  const compareDevs = useCallback(async (dev1: string, dev2: string, customKey?: string) => {
    if (!dev1.trim() || !dev2.trim()) return;
    setLoading(true); setError(null); clearAllData();
    const groqKey = customKey || getCustomGroqKey();
    try {
      const response = await fetch(COMPARE_DEVS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dev1: dev1.trim(), dev2: dev2.trim(), groqApiKey: groqKey || undefined }),
      });
      if (!response.ok) { const e = await response.json().catch(() => ({})); throw new Error((e as { error?: string }).error || `HTTP ${response.status}`); }
      const json = await response.json();
      incrementDailyUsage();
      setCompareDevsData(json);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed to compare devs'); } finally { setLoading(false); }
  }, []);

  return { analyze, analyzeRepo, compareRepos, compareDevs, loading, error, data, repoData, compareData, compareDevsData };
}
