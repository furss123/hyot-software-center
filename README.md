# HyoT Software Center

Windows utility software distribution platform.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/ko/`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Validate schemas + static export |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run validate:schemas` | Zod validation of `/data` |

## Documentation

See [docs/architecture.md](docs/architecture.md) for full project structure and conventions.

## Admin

Local CMS at `/admin` — never deployed. Run separately:

```bash
cd admin && npm install && npm run dev
```

## Deployment

### GitHub Pages Setup

1. Go to repo Settings → Pages → Source: GitHub Actions
2. Go to repo Settings → Variables → New repository variable:
   - Name: `GITHUB_PAGES_REPO`
   - Value: your repo name (e.g. `hyot-software-center`) OR leave empty for custom domain
3. Push to `main` → pages.yml deploys automatically

### Custom Domain

1. Add CNAME record pointing to `hyot.github.io`
2. Set `GITHUB_PAGES_REPO` to empty string in Actions variables
3. Replace `public/CNAME` content with your domain

### Local Development

```bash
cp .env.local.example .env.local
# Edit .env.local — leave GITHUB_PAGES_REPO empty for local dev
npm install
npm run dev
```
