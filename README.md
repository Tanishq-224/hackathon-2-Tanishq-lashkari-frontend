# Repairex Frontend

Smart electronics repair marketplace — customer and vendor UI.

**Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4, ESLint, Prettier, Jest + React Testing Library, React Router, TanStack Query, Axios, React Hook Form + Zod, shadcn/ui, Lucide React, **GSAP + ScrollTrigger**, **Lenis** (public marketing pages).

**Phase 1 (public site):** Home, About, and Contact on `PublicLayout`; auth routes use `AuthLayout` (forms ship in Phase 2). Responsive container max **1280px**; verify layouts at **1024 / 768 / 600 / 480** px when changing UI.

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

## App structure

```text
src/
├── components/   # ui (shadcn), layout, shared
├── features/     # domain modules (auth, repairs, …)
├── hooks/
├── lib/          # api client, query client, utils
├── pages/        # route-level views
├── providers/
└── routes/
```

## Repository

Separate from the Repairex backend. Product requirements: `REPAIREX_PROJECT_BRIEF.md` in the planning folder.
