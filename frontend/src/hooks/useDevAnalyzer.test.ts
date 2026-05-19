import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDevAnalyzer } from './useDevAnalyzer';

describe('useDevAnalyzer', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize with default states', () => {
    const { result } = renderHook(() => useDevAnalyzer());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
    expect(result.current.repoData).toBe(null);
    expect(result.current.compareData).toBe(null);
    expect(result.current.compareDevsData).toBe(null);
  });

  describe('analyze', () => {
    it('should successfully analyze a dev', async () => {
      const mockData = { username: 'testuser', devIq: 100, languageTags: [], analyzedReposCount: 1 };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData
      });

      const { result } = renderHook(() => useDevAnalyzer());

      act(() => {
        result.current.analyze('testuser');
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
      expect(global.fetch).toHaveBeenCalledWith('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser' })
      });
    });

    it('should handle API errors correctly', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'User not found' })
      });

      const { result } = renderHook(() => useDevAnalyzer());

      act(() => {
        result.current.analyze('testuser');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('User not found');
      expect(result.current.data).toBe(null);
    });

    it('should handle network errors correctly', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useDevAnalyzer());

      act(() => {
        result.current.analyze('testuser');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.data).toBe(null);
    });

    it('should ignore empty username', async () => {
      global.fetch = vi.fn();
      const { result } = renderHook(() => useDevAnalyzer());

      act(() => {
        result.current.analyze('   ');
      });

      expect(global.fetch).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
    });
  });

  describe('analyzeRepo', () => {
    it('should successfully analyze a repo', async () => {
      const mockRepoData = { owner: 'testuser', repoName: 'testrepo', devIq: 120, languageTags: [] };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockRepoData
      });

      const { result } = renderHook(() => useDevAnalyzer());

      act(() => {
        result.current.analyzeRepo('testuser/testrepo');
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.repoData).toEqual(mockRepoData);
      expect(global.fetch).toHaveBeenCalledWith('/api/analyze-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: 'testuser/testrepo' })
      });
    });
  });

  describe('compareRepos', () => {
    it('should successfully compare two repos', async () => {
      const mockCompareData = {
        repo1: { owner: 'test', repoName: 'repo1', devIq: 100, languageTags: [] },
        repo2: { owner: 'test', repoName: 'repo2', devIq: 110, languageTags: [] }
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCompareData
      });

      const { result } = renderHook(() => useDevAnalyzer());

      act(() => {
        result.current.compareRepos('test/repo1', 'test/repo2');
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.compareData).toEqual(mockCompareData);
      expect(global.fetch).toHaveBeenCalledWith('/api/compare-repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo1: 'test/repo1', repo2: 'test/repo2' })
      });
    });
  });

  describe('compareDevs', () => {
    it('should successfully compare two devs', async () => {
      const mockCompareDevsData = {
        dev1: { username: 'dev1', devIq: 100, languageTags: [], analyzedReposCount: 1 },
        dev2: { username: 'dev2', devIq: 110, languageTags: [], analyzedReposCount: 1 }
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCompareDevsData
      });

      const { result } = renderHook(() => useDevAnalyzer());

      act(() => {
        result.current.compareDevs('dev1', 'dev2');
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.compareDevsData).toEqual(mockCompareDevsData);
      expect(global.fetch).toHaveBeenCalledWith('/api/compare-devs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dev1: 'dev1', dev2: 'dev2' })
      });
    });
  });
});
