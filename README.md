# Repairex Frontend

Smart electronics repair marketplace — customer and vendor UI.

**Stack (Phase 0):** React 19, TypeScript, Vite 8, Tailwind CSS v4, ESLint, Prettier, Jest + React Testing Library. React Router, shadcn/ui, TanStack Query, and other brief items are added in later setup tasks.

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm

## Setup

```bash
git clone https://github.com/Tanishq-224/hackathon-2-Tanishq-lashkari-frontend.git
cd hackathon-2-Tanishq-lashkari-frontend
npm install
```

**Windows — copy env template:**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different host or port.

## Scripts

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Vite dev server              |
| `npm run build`        | Typecheck + production build |
| `npm run lint`         | ESLint                       |
| `npm run lint:fix`     | ESLint with auto-fix         |
| `npm run format`       | Prettier write               |
| `npm run format:check` | Prettier check (CI-friendly) |
| `npm run test`         | Jest + jsdom + RTL           |
| `npm run preview`      | Preview production build     |

## Environment variables

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

See `.env.example` for placeholders only. Never commit `.env`.

## Path alias

`@/` maps to `src/` (Vite + TypeScript + Jest).

## Repository

Separate from the Repairex backend. Product requirements: `REPAIREX_PROJECT_BRIEF.md` in the planning folder.
