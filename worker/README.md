# ⚡ Clash Dev Analyser — Backend

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Wrangler](https://img.shields.io/badge/Wrangler-v4-orange?style=for-the-badge)](https://developers.cloudflare.com/workers/wrangler/)

---

### 🚀 One-Click Deploy

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ajisth69/clash-dev-analyser/tree/backend)

> ⚠️ After deploying, you **must** set the `GITHUB_PAT` secret in your Cloudflare dashboard or via CLI. The worker will throw a clear error if it's missing.

</div>

---

## 🛠️ What is this?

This is the **Cloudflare Worker backend** for [Clash Dev Analyser](https://github.com/ajisth69/clash-dev-analyser). It powers all the GitHub data fetching, Dev IQ scoring, and deterministic codebase analysis — with zero AI, zero hallucination, just real metrics.

> 👉 Looking for the frontend? Switch to the [`frontend`](https://github.com/ajisth69/clash-dev-analyser/tree/frontend) branch.

---

## 📋 API Endpoints

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/analyze` | `{ "username": "ajisth69" }` | Analyze a GitHub user |
| `POST` | `/api/analyze-repo` | `{ "repo": "owner/repo" }` | Analyze a single repo |
| `POST` | `/api/compare-devs` | `{ "dev1": "...", "dev2": "..." }` | Battle two developers |
| `POST` | `/api/compare-repos` | `{ "repo1": "...", "repo2": "..." }` | Compare two repos |

---

## ⚙️ Setup & Deploy

### 1. Clone this branch

```bash
git clone --branch backend https://github.com/ajisth69/clash-dev-analyser.git clash-dev-analyser-backend
cd clash-dev-analyser-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set your environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .dev.vars
```

Edit `.dev.vars` with your real values (this file is gitignored).

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy to Cloudflare

```bash
npm run deploy
```

Then set your secrets via CLI:

```bash
wrangler secret put GITHUB_PAT
# Paste your GitHub token when prompted

# Optional (only if you want caching):
wrangler secret put CLASHDB_URL
wrangler secret put CLASHDB_API_KEY
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_PAT` | ✅ Yes | GitHub Personal Access Token. Create at [github.com/settings/tokens](https://github.com/settings/tokens). Only needs `public_repo` read scope. |
| `CLASHDB_URL` | ❌ No | Your ClashDB instance URL for caching results |
| `CLASHDB_API_KEY` | ❌ No | ClashDB API key |
| `CACHE_TTL_SECONDS` | ❌ No | How long to cache results. Default: `3600` (1 hour) |
| `LANGUAGE_REPO_LIMIT` | ❌ No | Repos to scan for language stats. Default: `8`. Keep ≤15 on free plan. |

> ⚠️ **CF Free Plan Note:** Cloudflare Workers free plan allows max **50 subrequests** per invocation. Keep `LANGUAGE_REPO_LIMIT` at `8` or below to avoid hitting this limit, especially in Dev Battle mode (which processes two users).

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

<div align="center">
Built by <a href="https://github.com/ajisth69">ajisth69</a>
</div>
