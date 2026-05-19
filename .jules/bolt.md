## 2024-11-20 - Sequential API Calls
**Learning:** External API fetches and internal recursive loop fetches (like getting evidence for multiple repos) were using `await` inside sequential loops. This increased latency as the worker waited for each request before firing the next.
**Action:** Always replace independent sequential asynchronous operations with `Promise.all` inside Cloudflare Workers or serverless functions to dramatically lower TTFB and improve throughput.
## 2026-05-19 - Using Promise.all for Parallel Fetching

**Learning:** When executing multiple independent asynchronous network requests inside a loop (like `fetchRepoEvidence` for multiple repositories), fetching sequentially (N+1 fetches) blocks subsequent iterations and drastically increases total execution time. The sequential execution takes roughly the sum of all individual request times.
**Action:** Always identify opportunities to map arrays to promises and use `Promise.all` to execute the requests concurrently, significantly reducing the total execution time to roughly the duration of the longest single request. Also, always add comments detailing performance optimizations when modifying code.
