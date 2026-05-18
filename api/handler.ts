/**
 * Vercel Edge Function — wraps the Cloudflare Worker handler.
 * Same codebase, works on both platforms.
 */
import workerModule from '../worker/src/worker';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  const env = {
    GITHUB_PAT: process.env.GITHUB_PAT || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    LANGUAGE_REPO_LIMIT: process.env.LANGUAGE_REPO_LIMIT || '8',
  };

  return workerModule.fetch(
    request,
    env as any,
    { waitUntil: () => {}, passThroughOnException: () => {} } as any
  );
}
