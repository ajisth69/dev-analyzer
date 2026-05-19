## 2025-05-19 - Overly Permissive Dynamic CORS Origin
**Vulnerability:** The API dynamically echoed any incoming `Origin` header in the `Access-Control-Allow-Origin` response header, effectively bypassing CORS protections.
**Learning:** This existed because developers often try to support multiple frontend deployments (like Vercel previews) by dynamically reflecting origins without proper whitelisting.
**Prevention:** Always validate incoming origins against an explicit whitelist of allowed domains (e.g., via environment variables). If no whitelist is configured, default to a safe static value like `*` (which prevents credentialed requests) rather than dynamic reflection.
