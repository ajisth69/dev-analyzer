## 2024-05-19 - O(N^2) Array Lookup Optimization

**Learning:** Replacing an Array.prototype.some() case-insensitive string lookup inside a loop with a Set tracking lowercase strings reduces time complexity from O(N^2) to O(N).

**Action:** When inserting unique items into a collection based on a normalized key (like lowercase strings) and order preservation is required, maintain both an array for the original items and a Set for O(1) membership checks of the normalized keys.
