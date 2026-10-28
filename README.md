# Repairex Frontend

Smart electronics repair marketplace — customer and vendor UI.

**Stack (Phase 0 in progress):** React, TypeScript, Vite. Tailwind CSS v4, shadcn/ui, React Router, TanStack Query, Jest, and the rest of the agreed stack will be added in follow-up setup tasks.

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm

## Setup

```bash
git clone https://github.com/Tanishq-224/hackathon-2-Tanishq-lashkari-frontend.git
cd hackathon-2-Tanishq-lashkari-frontend
npm install
cp .env.example .env
```

Edit `.env` if your backend runs on a different host or port.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start Vite dev server    |
| `npm run build`| Typecheck + production build |
| `npm run lint` | Run Oxlint (temporary; ESLint coming) |
| `npm run preview` | Preview production build |

## Environment variables

| Variable         | Description                    |
| ---------------- | ------------------------------ |
| `VITE_API_URL`   | Backend API base URL           |

See `.env.example` for placeholders only.

## Repository

This frontend is separate from the Repairex backend. Coordinate API contracts with the backend repository.

Product requirements live in the project brief (`REPAIREX_PROJECT_BRIEF.md` in the planning folder).
