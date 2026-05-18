# 🔬 Dev Analyzer

> Deterministic Analysis Engine for GitHub developers & repositories.
> Frontend + Backend deploy together. One URL. One command.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fajisth69%2Fdev-analyzer&env=GITHUB_PAT,GROQ_API_KEY&envDescription=GitHub%20PAT%20and%20Groq%20API%20Key%20required&envLink=https%3A%2F%2Fgithub.com%2Fsettings%2Ftokens&project-name=dev-analyzer&repository-name=dev-analyzer)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ajisth69/dev-analyzer)

---

## ⚡ One-Click Deploy

### ▲ Vercel (Easiest)

Click the button above, or:

1. Fork/push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo
3. Add environment variables:

| Variable | Value |
|----------|-------|
| `GITHUB_PAT` | Your GitHub token ([get one here](https://github.com/settings/tokens)) |
| `GROQ_API_KEY` | Your Groq key ([get one here](https://console.groq.com)) |

4. Click **Deploy** ✅

Vercel auto-builds the frontend, routes `/api/*` to the Edge Function.
Same backend code. One URL. Zero config.

---

### ☁️ Cloudflare Workers

Frontend + API served from a single Cloudflare Worker.

```bash
# Set secrets (first time only)
cd worker && npm install
npx wrangler login
npx wrangler secret put GITHUB_PAT
npx wrangler secret put GROQ_API_KEY
cd ..

# One-click deploy (builds frontend + deploys everything)
# Windows:
powershell -File deploy-cloudflare.ps1

# macOS/Linux:
bash deploy-cloudflare.sh
```

One command. One URL. Done.

---

## 🛠️ Local Development

```bash
# Terminal 1 — Backend
cd worker
npm install
# Create .dev.vars with:
#   GITHUB_PAT=ghp_xxx
#   GROQ_API_KEY=gsk_xxx
npx wrangler dev --local --port 8787

# Terminal 2 — Frontend (auto-proxies /api → worker)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 🔑 Required Secrets

| Secret | Where to get |
|--------|-------------|
| `GITHUB_PAT` | [github.com/settings/tokens](https://github.com/settings/tokens) — needs `read:user`, `repo` |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) — free tier works |

---

## 📁 Structure

```
dev-analyzer/
├── api/                        ← Vercel Edge Function (wraps worker)
│   └── handler.ts
├── worker/                     ← Cloudflare Worker (core backend)
│   ├── src/worker.ts           ← All API logic
│   ├── src/analysisCore.ts     ← Deterministic engine
│   ├── wrangler.toml
│   └── .dev.vars               ← Local secrets (git-ignored)
├── frontend/                   ← React + Vite + Tailwind
│   ├── src/
│   └── dist/                   ← Built output
├── deploy-cloudflare.ps1       ← One-click deploy (Windows)
├── deploy-cloudflare.sh        ← One-click deploy (macOS/Linux)
├── vercel.json                 ← Vercel config (auto-detected)
└── README.md
```

`api/handler.ts` imports `worker/src/worker.ts` directly — same backend, both platforms, zero duplication.

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 👤 Dev Analysis | Score any GitHub profile with 10+ metrics |
| 📦 Repo Analysis | Deep dive into any repository |
| ⚔️ Battle Mode | Compare devs or repos head-to-head |
| 🔥 Roast Mode | Savage, funny code roasts |
| 📊 Intelligence Report | Per-category verdicts |
| 📸 Export | Screenshot any report as PNG |
| 🚫 No Database | Fully stateless |

---

## 📝 License

MIT © [ajisth69](https://github.com/ajisth69)
