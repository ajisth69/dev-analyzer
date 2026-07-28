import { describe, it, expect } from 'vitest';
import worker from '../worker';

describe('Worker End-to-End API Integration', () => {
  const mockEnv = {
    GITHUB_PAT: 'mock_token',
  };

  it('rejects invalid username formats with 400', async () => {
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'invalid/user/path' }),
    });

    const res = await worker.fetch(req, mockEnv as any, {} as any);
    expect(res.status).toBe(400);
    const body = await res.json() as any;
    expect(body.error).toBe('Invalid GitHub username format');
  });

  it('rejects invalid repo formats with 400', async () => {
    const req = new Request('http://localhost/api/analyze-repo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo: 'invalidrepo' }),
    });

    const res = await worker.fetch(req, mockEnv as any, {} as any);
    expect(res.status).toBe(400);
    const body = await res.json() as any;
    expect(body.error).toBe('Invalid repo format. Use owner/repo');
  });

  it('handles badge.svg requests with proper SVG headers', async () => {
    const req = new Request('http://localhost/api/badge.svg?user=invalid@user', {
      method: 'GET',
    });

    const res = await worker.fetch(req, mockEnv as any, {} as any);
    expect(res.headers.get('Content-Type')).toBe('image/svg+xml');
    const text = await res.text();
    expect(text).toContain('DevAnalyzer');
  });

  describe('CORS policy', () => {
    it('allows localhost:3000', async () => {
      const req = new Request('http://localhost/api/badge.svg', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      });
      const res = await worker.fetch(req, mockEnv as any, {} as any);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });

    it('rejects arbitrary localhost ports', async () => {
      const req = new Request('http://localhost/api/badge.svg', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:8080'
        }
      });
      const res = await worker.fetch(req, mockEnv as any, {} as any);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    });

    it('allows explicitly listed ALLOWED_ORIGINS', async () => {
      const req = new Request('http://localhost/api/badge.svg', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://example.com'
        }
      });
      const envWithAllowedOrigin = { ...mockEnv, ALLOWED_ORIGINS: 'https://example.com, https://test.com' };
      const res = await worker.fetch(req, envWithAllowedOrigin as any, {} as any);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://example.com');
    });

    it('rejects unlisted domains', async () => {
      const req = new Request('http://localhost/api/badge.svg', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://malicious.com'
        }
      });
      const envWithAllowedOrigin = { ...mockEnv, ALLOWED_ORIGINS: 'https://example.com' };
      const res = await worker.fetch(req, envWithAllowedOrigin as any, {} as any);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    });
  });
});
