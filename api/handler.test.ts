import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler, { config } from './handler';
import workerModule from '../worker/src/worker';

vi.mock('../worker/src/worker', () => ({
  default: {
    fetch: vi.fn(),
  },
}));

describe('Vercel Edge Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GITHUB_PAT = 'test-github-pat';
    process.env.GROQ_API_KEY = 'test-groq-key';
    process.env.LANGUAGE_REPO_LIMIT = '10';
  });

  it('exports edge config', () => {
    expect(config).toEqual({ runtime: 'edge' });
  });

  it('calls workerModule.fetch with correctly mapped environment variables', async () => {
    const mockRequest = new Request('https://example.com');
    const mockResponse = new Response('ok');
    vi.mocked(workerModule.fetch).mockResolvedValue(mockResponse);

    const response = await handler(mockRequest);

    expect(workerModule.fetch).toHaveBeenCalledWith(
      mockRequest,
      {
        GITHUB_PAT: 'test-github-pat',
        GROQ_API_KEY: 'test-groq-key',
        LANGUAGE_REPO_LIMIT: '10',
      },
      expect.objectContaining({
        waitUntil: expect.any(Function),
        passThroughOnException: expect.any(Function),
      })
    );

    expect(response).toBe(mockResponse);
  });

  it('uses fallback empty strings for missing environment variables', async () => {
    delete process.env.GITHUB_PAT;
    delete process.env.GROQ_API_KEY;
    delete process.env.LANGUAGE_REPO_LIMIT;

    const mockRequest = new Request('https://example.com');
    vi.mocked(workerModule.fetch).mockResolvedValue(new Response('ok'));

    await handler(mockRequest);

    expect(workerModule.fetch).toHaveBeenCalledWith(
      mockRequest,
      {
        GITHUB_PAT: '',
        GROQ_API_KEY: '',
        LANGUAGE_REPO_LIMIT: '8', // Note the default '8' here
      },
      expect.any(Object)
    );
  });
});
