# SkyCast

Full-stack weather app with real-time data, solar cycle calculations, and personalized recommendations.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS · MobX · Axios · PostgreSQL · Prisma · Better Auth · Vitest

---

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL (local or remote)
- OpenWeather API key — [get free key](https://openweathermap.org/api)

---

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env file and fill in your values
cp .env.example .env

# 3. Run database migration
pnpm prisma migrate dev --name init

# 4. Generate Prisma client
pnpm prisma generate
```

---

## Running

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start
```

---

## Commands

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `pnpm dev`           | Start dev server at localhost:3000 |
| `pnpm build`         | Build for production               |
| `pnpm lint`          | Run ESLint                         |
| `pnpm typecheck`     | Run TypeScript check               |
| `pnpm test`          | Run unit tests (Vitest)            |
| `pnpm format`        | Auto-format with Prettier          |
| `pnpm prisma studio` | Open Prisma DB browser             |

---

## Project Structure

```
app/                    # Next.js App Router — routing only
├── page.tsx            # Home page
├── details/[city]/     # City details page
├── favorites/          # Favorites page
├── api/                # Route handlers (server-side)
└── layout.tsx          # Root layout

src/
├── screens/            # UI logic per page
├── modules/            # Business logic (weather, solar, recommendations, favorites)
├── ui/                 # Reusable components
├── stores/             # MobX stores
├── lib/                # Axios client, constants, theme
├── hooks/              # Custom hooks
└── types/              # Shared TypeScript types

prisma/
└── schema.prisma       # Database schema
```

---

## Environment Variables

| Variable              | Description                                 |
| --------------------- | ------------------------------------------- |
| `OPENWEATHER_API_KEY` | API key from openweathermap.org             |
| `DATABASE_URL`        | PostgreSQL connection string                |
| `BETTER_AUTH_SECRET`  | Random secret (`openssl rand -base64 32`)   |
| `BETTER_AUTH_URL`     | App base URL (e.g. `http://localhost:3000`) |
