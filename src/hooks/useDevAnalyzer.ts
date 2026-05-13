import { useState, useCallback } from 'react';
import { openDB } from 'idb';

const DB_NAME = 'DevAnalyzerCacheV6';
const STORE_NAME = 'devProfiles';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

export interface AnalysisMetrics {
  Logic: number;
  Documentation: number;
  Versatility: number;
  Popularity: number;
  Architecture?: number;
  Modernity?: number;
  [key: string]: number | undefined;
}

export interface TrackSignal {
  name: string;
  score: number;
  evidence: string[];
}

export type Severity = 'critical' | 'high' | 'medium' | 'low';

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
  version?: string;
  source?: 'heuristic' | 'osv' | 'deps.dev' | 'scorecard' | 'github';
  recommendation: string;
}

export interface DependencyQuery {
  ecosystem: string;
  packageName: string;
  version?: string;
  manifest: string;
}

export interface ExternalDependencySignal {
  ecosystem: string;
  packageName: string;
  version?: string;
  vulnerabilityId?: string;
  title: string;
  detail: string;
  severity: Severity;
  source: 'osv' | 'deps.dev' | 'github';
  recommendation: string;
}

export interface ExternalRepoSignal {
  source: 'scorecard' | 'github';
  title: string;
  detail: string;
  severity: Severity;
  score?: number;
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
  languageDistribution: Array<{ name: string; pct: number; color: string }>;
  roleFits: Array<{ role: string; score: number; matched: string[]; gaps: string[] }>;
  codebaseHealth: {
    overall: number;
    categories: Array<{ label: string; score: number; evidence: string }>;
    blockers: string[];
  };
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
  deepAnalysis?: {
    summary: string;
    architecture: string;
    modernity: string;
    security: string;
    scalability: string;
    remarks: Array<{ topic: string; remark: string }>;
  };
}

export interface AnalyzerResponse {
  username: string;
  devIq: number;
  languageTags: string[];
  maturityAnalysis?: {
    summary: string;
    metrics: AnalysisMetrics;
    architecture: string;
    modernity: string;
    security: string;
    scalability: string;
    remarks: Array<{ topic: string; remark: string }>;
  };
  seniorityAnalysis?: any; // Fallback for old worker
  analyzedReposCount: number;
  advancedAnalysis?: AdvancedAnalysis;
}

export interface RepoAnalysisResponse {
  owner: string;
  repoName: string;
  devIq: number;
  languageTags: string[];
  maturityAnalysis?: {
    summary: string;
    metrics: AnalysisMetrics;
    architecture: string;
    modernity: string;
    security: string;
    scalability: string;
    remarks: Array<{ topic: string; remark: string }>;
  };
  seniorityAnalysis?: any; // Fallback for old worker
  advancedAnalysis?: AdvancedAnalysis;
}

export interface CompareResponse {
  repo1: RepoAnalysisResponse;
  repo2: RepoAnalysisResponse;
}

export interface CompareDevsResponse {
  dev1: AnalyzerResponse;
  dev2: AnalyzerResponse;
}

const BASE_URL = 'https://github-repo-analyser.ajisth007.workers.dev';
const WORKER_URL = `${BASE_URL}/api/analyze`;
const ANALYZE_REPO_URL = `${BASE_URL}/api/analyze-repo`;
const COMPARE_URL = `${BASE_URL}/api/compare-repos`;
const COMPARE_DEVS_URL = `${BASE_URL}/api/compare-devs`;

export function useDevAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<AnalyzerResponse | null>(null);
  const [repoData, setRepoData] = useState<RepoAnalysisResponse | null>(null);
  const [compareData, setCompareData] = useState<CompareResponse | null>(null);
  const [compareDevsData, setCompareDevsData] = useState<CompareDevsResponse | null>(null);

  const initDB = async () => {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  };

  const clearAllData = () => {
    setData(null);
    setRepoData(null);
    setCompareData(null);
    setCompareDevsData(null);
  }

  const analyze = useCallback(async (username: string) => {
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    clearAllData();

    const lowerUsername = username.toLowerCase();

    try {
      const db = await initDB();
      const cached: any = await db.get(STORE_NAME, `user_${lowerUsername}`);

      if (cached && (Date.now() - cached.timestamp < CACHE_EXPIRY)) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: lowerUsername }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }

      const result: AnalyzerResponse = await response.json();
      await db.put(STORE_NAME, { data: result, timestamp: Date.now() }, `user_${lowerUsername}`);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze developer profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeRepo = useCallback(async (repo: string) => {
    if (!repo.trim()) return;

    setLoading(true);
    setError(null);
    clearAllData();

    const lowerRepo = repo.toLowerCase();

    try {
      const db = await initDB();
      const cached: any = await db.get(STORE_NAME, `repo_${lowerRepo}`);

      if (cached && (Date.now() - cached.timestamp < CACHE_EXPIRY)) {
        setRepoData(cached.data);
        setLoading(false);
        return;
      }

      const response = await fetch(ANALYZE_REPO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: lowerRepo }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }

      const result: RepoAnalysisResponse = await response.json();
      await db.put(STORE_NAME, { data: result, timestamp: Date.now() }, `repo_${lowerRepo}`);
      setRepoData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  }, []);

  const compareRepos = useCallback(async (repo1: string, repo2: string) => {
    if (!repo1.trim() || !repo2.trim()) return;

    setLoading(true);
    setError(null);
    clearAllData();

    const cacheKey = `compare_${repo1}_${repo2}`.toLowerCase();

    try {
      const db = await initDB();
      const cached: any = await db.get(STORE_NAME, cacheKey);

      if (cached && (Date.now() - cached.timestamp < CACHE_EXPIRY)) {
        setCompareData(cached.data);
        setLoading(false);
        return;
      }

      const response = await fetch(COMPARE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo1, repo2 }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }

      const result: CompareResponse = await response.json();
      await db.put(STORE_NAME, { data: result, timestamp: Date.now() }, cacheKey);
      setCompareData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to compare repositories');
    } finally {
      setLoading(false);
    }
  }, []);

  const compareDevs = useCallback(async (dev1: string, dev2: string) => {
    if (!dev1.trim() || !dev2.trim()) return;

    setLoading(true);
    setError(null);
    clearAllData();

    const cacheKey = `comparedevs_${dev1}_${dev2}`.toLowerCase();

    try {
      const db = await initDB();
      const cached: any = await db.get(STORE_NAME, cacheKey);

      if (cached && (Date.now() - cached.timestamp < CACHE_EXPIRY)) {
        setCompareDevsData(cached.data);
        setLoading(false);
        return;
      }

      const response = await fetch(COMPARE_DEVS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dev1, dev2 }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }

      const result: CompareDevsResponse = await response.json();
      await db.put(STORE_NAME, { data: result, timestamp: Date.now() }, cacheKey);
      setCompareDevsData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to compare developers');
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, analyzeRepo, compareRepos, compareDevs, loading, error, data, repoData, compareData, compareDevsData };
}
