# OWASP Security Lab

A local full-stack Task Manager built for learning OWASP dep-scan. It intentionally pins outdated direct npm dependencies in `app/backend/package.json` to make dependency scanning practice meaningful.

## Safety
This is a deliberately vulnerable training project. Run it locally only, do not expose it to the public internet, and never reuse the pinned dependency versions in production. Scanner findings depend on the scanner version and vulnerability database.

## Requirements
- Ubuntu / WSL Ubuntu
- Node.js 20+ and npm (for local run)
- Docker Engine (for Docker-based scanning or container run)

## 1. Install backend dependencies
From this project root:

```bash
npm run install:backend
```

This creates `app/backend/package-lock.json`. Keep it in the project because it records the resolved dependency tree used for scanning.

## 2. Run locally
```bash
npm start
```
Open http://localhost:3000

API endpoints:
- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks` with JSON `{"title":"Review scan output"}`
- `PATCH /api/tasks/:id` with JSON `{"completed":true}`
- `DELETE /api/tasks/:id`
- `GET /api/lab-info` lists installed dependency versions

Stop with Ctrl+C.

## 3. Run with Docker Compose (optional)
```bash
docker compose up --build
```
Open http://localhost:3000. Stop with `Ctrl+C`, then `docker compose down`.

## 4. Run OWASP dep-scan
First make sure backend dependencies have been installed (Step 1), then from the project root:

```bash
mkdir -p reports
docker run --rm \
  -v "$PWD:/app" \
  ghcr.io/owasp-dep-scan/dep-scan \
  depscan --src /app --reports-dir /app/reports
```

Or run the included helper:
```bash
bash scripts/scan.sh
```

The initial scan can take time while scanner data is fetched. Inspect terminal output and files under `reports/`; report names/formats can vary by dep-scan release.

## 5. Learning exercise
1. Run a baseline scan and note package, installed version, advisory/CVE identifier, and severity.
2. Inspect the direct and transitive dependencies in `app/backend/package-lock.json`.
3. Upgrade a dependency to a maintained patched version.
4. Run `npm install` again.
5. Scan again and compare results. Do not assume that every finding disappears after a single upgrade.

## Project layout
```text
owasp-security-lab/
├── app/
│   ├── backend/
│   │   ├── package.json
│   │   └── server.js
│   └── frontend/
│       ├── app.js
│       ├── index.html
│       └── styles.css
├── reports/
├── scripts/scan.sh
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Official project
OWASP dep-scan: https://github.com/owasp-dep-scan/dep-scan
