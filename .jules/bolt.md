## 2024-05-24 - Optimizing global regex in loops

**Learning:** Declaring a regular expression literal with the global flag (`/g`) inside a loop causes it to be re-instantiated and compiled on every iteration, leading to significant performance overhead (e.g. 20% slowdown on 50k files).

**Action:** Extract global regex literals outside of loops. When doing so, ensure you reset `regex.lastIndex = 0` inside the loop before `exec()` is called to prevent state leakage and missed matches across iterations.
