## 2024-05-18 - Prevent Error Detail Leakage
**Vulnerability:** The global Cloudflare Worker try/catch block returned raw `error.message` strings directly to the client in a 500 status response (`{ error: error.message }`).
**Learning:** Returning unhandled runtime exceptions directly to the frontend can inadvertently expose sensitive configuration data, like missing environment variables (e.g., `GITHUB_PAT environment variable is not set`), API key details, or internal application state, giving attackers reconnaissance data.
**Prevention:** Catch all unhandled exceptions globally, log them securely on the server (`console.error`), and return a sanitized, generic error message (e.g., `"An internal server error occurred"`) to the client.
