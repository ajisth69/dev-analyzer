## 2024-11-20 - Sequential API Calls
**Learning:** External API fetches and internal recursive loop fetches (like getting evidence for multiple repos) were using `await` inside sequential loops. This increased latency as the worker waited for each request before firing the next.
**Action:** Always replace independent sequential asynchronous operations with `Promise.all` inside Cloudflare Workers or serverless functions to dramatically lower TTFB and improve throughput.
