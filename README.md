# SkyCast

Full-stack weather app with real-time data, solar cycle calculations, and personalized recommendations.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS · MobX · Axios · PostgreSQL · Prisma · Better Auth · Vitest

---

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL (local or remote)
- OpenWeather API key — [get free key](https://openweathermap.org/api)
- Google OAuth credentials — [Google Cloud Console](https://console.cloud.google.com)

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
├── lib/                # Axios client, constants, cache, theme
├── hooks/              # Custom hooks
└── types/              # Shared TypeScript types

prisma/
└── schema.prisma       # Database schema
```

---

## Environment Variables

| Variable                        | Description                                          |
| ------------------------------- | ---------------------------------------------------- |
| `OPENWEATHER_API_KEY`           | API key from openweathermap.org                      |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | Same key — used client-side for map tiles          |
| `DATABASE_URL`                  | PostgreSQL connection string                         |
| `BETTER_AUTH_SECRET`            | Random secret (`openssl rand -base64 32`)            |
| `BETTER_AUTH_URL`               | App base URL (e.g. `http://localhost:3000`)          |
| `NEXT_PUBLIC_BETTER_AUTH_URL`   | Same as above — used client-side                     |
| `GOOGLE_CLIENT_ID`              | From Google Cloud Console OAuth 2.0                  |
| `GOOGLE_CLIENT_SECRET`          | From Google Cloud Console OAuth 2.0                  |

**Google OAuth redirect URI to configure:** `http://localhost:3000/api/auth/callback/google`

---

## State Management — Why MobX

The app uses **MobX** with `mobx-react-lite` for all client-side state.

**Why MobX over Zustand or Redux:**

- **MVVM pattern** — MobX maps directly to the ViewModel layer. Stores are observable classes, screens are Views that react automatically to changes. This produces a clean separation between UI and business logic.
- **Less boilerplate** — `makeAutoObservable` turns a plain class into a reactive store with zero ceremony. No actions, reducers, or selectors to wire up manually.
- **Computed values** — `isFavorite(city)` and similar derived state update automatically when `favorites` changes, without manual memoization.
- **`flow()` for async** — MobX `flow` handles async actions (weather fetching) in a readable generator syntax with built-in cancellation support.

**Store location:** `src/stores/weather-store/index.ts`

The `WeatherStore` owns all client state: current weather, forecast, favorites list, search query, and loading/error states. Screens consume it via `useWeatherStore()` hook and re-render only when their observed values change.

---

## Caching Strategy

Weather data is cached using **Next.js `unstable_cache`** — a built-in server-side cache that implements stale-while-revalidate semantics.

**Implementation:** `src/lib/weather-cache.ts`

```
Request → Route Handler → unstable_cache → OpenWeather API
                               ↓
                        Cache (10 min TTL)
                        Serve instantly + revalidate in background
```

**How it works:**
- First request for a city → fetches from OpenWeather API, stores result in cache
- Subsequent requests within 10 minutes → served from cache instantly (no API call)
- After 10 minutes → stale data served immediately, fresh fetch triggered in background
- Cache is keyed by city name, separate entries per city

**How to verify it's working:**

1. Run `pnpm dev` and watch the terminal
2. Search for a city → terminal shows `[CACHE MISS] weather:London`
3. Search same city again → terminal is silent (cache hit)
4. In DevTools → Network → check response headers:
   - `X-Cache: MISS` — fresh data from API
   - `X-Cache: HIT` — served from cache
   - `X-Cache-Age: 45s` — how old the cached data is

**Works on:** Vercel (distributed cache), Render single-instance, any Node.js server.
