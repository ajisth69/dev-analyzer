# Dev Analyzer

Deterministic analysis engine for GitHub developers and repositories. Lightweight, stateless architecture with dual Cloudflare Worker and Vercel support.

---

## Features

- Developer Analysis: Evaluates GitHub user profiles across key performance metrics.
- Repository Analysis: Provides technical depth and maintenance scores for any public repository.
- Battle Mode: Head-to-head metrics comparison between developers or repositories.
- Roast Mode: AI-generated technical feedback based on profile activity.
- Intelligence Reports: Per-category metrics breakdown and deterministic scoring.
- Export Capabilities: Generate downloadable visual summary cards.
- Stateless Architecture: Zero database dependency, real-time GitHub API aggregation.

---

## Commits

This project follows conventional commit standard for git commit history:

- `feat`: New features or capabilities
- `fix`: Bug fixes and corrections
- `docs`: Documentation updates
- `refactor`: Code restructuring without functional changes
- `chore`: Build processes, dependencies, or maintenance

---

## Environment Variables

| Variable | Description | Source |
| --- | --- | --- |
| `GITHUB_PAT` | GitHub Personal Access Token | [github.com/settings/tokens](https://github.com/settings/tokens) |
| `GROQ_API_KEY` | Groq API Key | [console.groq.com](https://console.groq.com) |

---

## Quickstart

### Local Development

1. Start backend worker:
```bash
cd worker
npm install
npx wrangler dev --local --port 8787
```

2. Start frontend application:
```bash
cd frontend
npm install
npm run dev
```

---

## Deployment

### Vercel

1. Fork repository to GitHub.
2. Import project at [vercel.com/new](https://vercel.com/new).
3. Configure environment variables (`GITHUB_PAT`, `GROQ_API_KEY`).
4. Deploy.

### Cloudflare Workers

```bash
cd worker
npm install
npx wrangler secret put GITHUB_PAT
npx wrangler secret put GROQ_API_KEY
cd ..
powershell -File deploy-cloudflare.ps1
```

---

## Project Structure

```
dev-analyzer/
├── api/                    Edge API function
├── frontend/               React + Vite UI application
├── worker/                 Cloudflare Worker API engine
├── CONTRIBUTING.md         Contribution guidelines
├── CODE_OF_CONDUCT.md      Community behavior standards
├── LICENSE                 MIT License
├── SECURITY.md             Vulnerability reporting policy
└── README.md               Project documentation
```

---

## Governance & Community

- [Contributing](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [License](LICENSE) (MIT License)
