import { renderHook, act } from '@testing-library/react';
import { useDevAnalyzer } from './useDevAnalyzer';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useDevAnalyzer', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // analyze
  it('analyze should handle error when fetch returns non-ok status', async () => {
    const mockErrorResponse = { error: 'Not Found' };
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(mockErrorResponse),
    });

    const { result } = renderHook(() => useDevAnalyzer());

    await act(async () => {
      await result.current.analyze('nonexistentuser');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Not Found');
    expect(result.current.data).toBeNull();
  });

  it('analyze should handle error when fetch throws network error (catch block)', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useDevAnalyzer());

    await act(async () => {
      await result.current.analyze('networkerroruser');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network Error');
    expect(result.current.data).toBeNull();
  });

  it('analyze should handle successful response', async () => {
    const mockResponse = { username: 'testuser', devIq: 100 };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useDevAnalyzer());

    await act(async () => {
      await result.current.analyze('testuser');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockResponse);
  });

  // analyzeRepo
  it('analyzeRepo should handle error when fetch returns non-ok status', async () => {
    const mockErrorResponse = { error: 'Not Found' };
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(mockErrorResponse),
    });

    const { result } = renderHook(() => useDevAnalyzer());

    await act(async () => {
      await result.current.analyzeRepo('nonexistentrepo');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Not Found');
    expect(result.current.repoData).toBeNull();
  });

  it('analyzeRepo should handle error when fetch throws network error (catch block)', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useDevAnalyzer());

    await act(async () => {
      await result.current.analyzeRepo('networkerrorrepo');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network Error');
    expect(result.current.repoData).toBeNull();
  });

  it('analyzeRepo should handle successful response', async () => {
    const mockResponse = { repoName: 'testrepo', devIq: 100 };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useDevAnalyzer());

    await act(async () => {
      await result.current.analyzeRepo('testrepo');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.repoData).toEqual(mockResponse);
  });

  // compareRepos
  it('compareRepos should handle error when fetch returns non-ok status', async () => {
    const mockErrorResponse = { error: 'Not Found' };
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(mockErrorResponse),
    });

    const { result } = renderHook(() => useDevAnalyzer());

    await act(async () => {
      await result.current.compareRepos('repo1', 'repo2');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Not Found');
    expect(result.current.compareData).toBeNull();
  });

  it('compareRepos should handle error when fetch throws network error (catch block)', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useDevAnalyzer());

    await act(async () => {
      await result.current.compareRepos('repo1', 'repo2');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network Error');
    expect(result.current.compareData).toBeNull();
  });

  it('compareRepos should handle successful response', async () => {
    const mockResponse = { repo1: { repoName: 'repo1' }, repo2: { repoName: 'repo2' } };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useDevAnalyzer());

    await act(async () => {
      await result.current.compareRepos('repo1', 'repo2');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.compareData).toEqual(mockResponse);
  });

  // compareDevs
  it('compareDevs should handle error when fetch returns non-ok status', async () => {
    const mockErrorResponse = { error: 'Not Found' };
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(mockErrorResponse),
    });

    const { result } = renderHook(() => useDevAnalyzer());

    await act(async () => {
      await result.current.compareDevs('dev1', 'dev2');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Not Found');
    expect(result.current.compareDevsData).toBeNull();
  });

  it('compareDevs should handle error when fetch throws network error (catch block)', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useDevAnalyzer());

    await act(async () => {
      await result.current.compareDevs('dev1', 'dev2');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network Error');
    expect(result.current.compareDevsData).toBeNull();
  });

  it('compareDevs should handle successful response', async () => {
    const mockResponse = { dev1: { username: 'dev1' }, dev2: { username: 'dev2' } };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useDevAnalyzer());

    await act(async () => {
      await result.current.compareDevs('dev1', 'dev2');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.compareDevsData).toEqual(mockResponse);
  });
});
