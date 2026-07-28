## 2024-05-18 - Restrict Localhost CORS Policy

**Vulnerability:** The CORS policy in `worker/src/worker.ts` explicitly allowed any port on localhost using a regex (`/^https?:\/\/localhost(:\d+)?$/`), which is overly permissive. Additionally, it checked the request URL's origin instead of the `Origin` header.
**Learning:** Overly permissive wildcard-like regexes for CORS can lead to unauthorized cross-origin access. Furthermore, CORS evaluation must be performed against the `Origin` header sent by the client, not the requested URL's origin.
**Prevention:** Explicitly specify the exact ports required for development (e.g., `localhost:3000`). Always extract the origin from the `Origin` header for CORS validation (`request.headers.get("Origin")`).
