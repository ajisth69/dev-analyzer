## 2024-05-15 - Regex Compilation Optimization

**Learning:** Recompiling the same Regular Expression object (using `new RegExp()`) inside a tight loop causes significant performance overhead in JavaScript.

**Action:** When a regular expression pattern and its flags are constant, hoist its compilation outside of loops. If the regex uses the global (`g`) flag, remember to reset its state by adding `regex.lastIndex = 0` inside the loop before it is evaluated against a new string, ensuring matches start from the beginning.
