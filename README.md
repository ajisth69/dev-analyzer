# Dev Analyzer

Deterministic analysis engine for GitHub developers and repositories. Lightweight, stateless architecture deployed on Vercel.

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

1. Install dependencies:
```bash
npm install
cd frontend && npm install
```

2. Start frontend dev server:
```bash
npm run dev
```

---

## Deployment

### Vercel (One-Click)

1. Fork repository to GitHub.
2. Import project at [vercel.com/new](https://vercel.com/new).
3. Configure environment variables (`GITHUB_PAT`, `GROQ_API_KEY`).
4. Click **Deploy**.

Vercel automatically builds the frontend and routes API requests to Vercel Edge Functions.

---

## Project Structure

```
dev-analyzer/
├── api/                    Edge API function
├── frontend/               React + Vite UI application
├── worker/                 Core deterministic backend engine
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
