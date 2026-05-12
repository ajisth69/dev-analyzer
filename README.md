# 🔥 Clash Dev Analyser — Frontend

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

---

### 🚀 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ajisth69/clash-dev-analyser/tree/frontend&root-directory=.&framework=vite)
[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://dash.cloudflare.com/pages/new?repo=ajisth69/clash-dev-analyser)
[![Netlify Deploy Button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ajisth69/clash-dev-analyser#frontend)

> 👉 Looking for the backend (Cloudflare Worker)? Switch to the [`backend`](https://github.com/ajisth69/clash-dev-analyser/tree/backend) branch.

</div>

---

## ✨ What is this?

**Clash Dev Analyser** is a deterministic GitHub intelligence tool. No AI. No hallucinations. Just raw, algorithmic developer and repo analysis powered by real GitHub data.

- **Analyze a Developer** → Dev IQ score, language profile, track detection, role fits
- **Analyze a Repo** → Codebase health, maturity, language distribution
- **Dev Battle** → Compare two developers head-to-head with a winner
- **Repo Battle** → Compare two repos side by side

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 |
| Build Tool | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Export | html2canvas |

---

## 🚀 Getting Started

### 1. Clone this branch

```bash
git clone --branch frontend https://github.com/ajisth69/clash-dev-analyser.git clash-dev-analyser-frontend
cd clash-dev-analyser-frontend
```

### 2. Install & run

```bash
npm install
npm run dev
```

### 3. Point to your backend

By default the frontend expects the backend worker at a deployed Cloudflare Workers URL. Update the API base URL in your environment or in the fetch hook.

Deploy the backend first → [`backend` branch instructions](https://github.com/ajisth69/clash-dev-analyser/tree/backend)

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

<div align="center">
Built by <a href="https://github.com/ajisth69">ajisth69</a>
</div>
