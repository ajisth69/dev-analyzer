# 🔬 Dev Analyzer — GitHub Intelligence Engine

> Deterministic Analysis Engine that scores GitHub developers and repositories. Frontend + Backend in a single Cloudflare Worker deployment.

---

## ⚡ One-Click Deploy

```bash
cd worker
npm install
cd ../frontend && npm install && cd ../worker

# Set secrets (only first time)
npx wrangler secret put GITHUB_PAT
npx wrangler secret put GROQ_API_KEY

# Deploy everything — frontend + backend — single command
npm run deploy
```

That's it. One URL. Everything works. No separate frontend deploy.

---

## 🛠️ Local Development

```bash
# Terminal 1 — Backend
cd worker
npx wrangler dev --local --port 8787

# Terminal 2 — Frontend (proxies /api to worker)
cd frontend
npm run dev
```

---

## 🔑 Secrets

| Secret | Get it from |
|--------|-------------|
| `GITHUB_PAT` | [github.com/settings/tokens](https://github.com/settings/tokens) |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) |

For local dev, create `worker/.dev.vars`:
```
GITHUB_PAT=ghp_xxx
GROQ_API_KEY=gsk_xxx
```

---

## 🎯 Features

- **Developer Analysis** — Score any GitHub profile
- **Repository Analysis** — Deep dive into any repo
- **Battle Mode** — Compare devs or repos head-to-head
- **Intelligence Report** — 10 verdict categories
- **Roast Mode** — Savage code roasts 🔥
- **Per-Repo Scoring** — Individual scores for top repos
- **Export Reports** — Screenshot as PNG

---

## 📝 License

MIT © [ajisth69](https://github.com/ajisth69)
