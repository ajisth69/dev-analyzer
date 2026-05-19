async function fetchMockData(id: number): Promise<string> {
  // Simulate network latency of 100ms
  return new Promise((resolve) => setTimeout(() => resolve(`Data ${id}`), 100));
}

async function sequentialFetch(items: number[]) {
  const start = performance.now();
  let results: string[] = [];
  for (const item of items) {
    const data = await fetchMockData(item);
    results.push(data);
  }
  const end = performance.now();
  console.log(`Sequential Fetch (baseline): ${end - start}ms`);
}

async function parallelFetch(items: number[]) {
  const start = performance.now();
  const results = await Promise.all(items.map((item) => fetchMockData(item)));
  const end = performance.now();
  console.log(`Parallel Fetch (optimized): ${end - start}ms`);
}

async function runBenchmark() {
  const items = Array.from({ length: 15 }, (_, i) => i + 1); // Mock 15 repos
  console.log("Starting benchmark for N+1 fetches...");

  await sequentialFetch(items);
  await parallelFetch(items);

  console.log("Benchmark complete.");
}

runBenchmark();
