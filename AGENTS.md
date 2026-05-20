# SkyCast — Agent Instructions

Architecture, conventions, and rules for AI agents working on this codebase.

## Architecture: MVVM

```
View       →  src/screens/ + src/ui/
ViewModel  →  src/stores/
Model      →  src/modules/
```

**Data flow (one direction only):**
```
OpenWeather API → Route Handler → Model → ViewModel (MobX) → View
```

**Layer rules:**
- `src/screens/` — UI only. No direct API calls. Only reads from MobX store.
- `src/stores/` — MobX `makeAutoObservable`. Calls Model functions via Axios.
- `src/modules/` — Pure business logic. No UI. No MobX.
- `app/api/` — Route Handlers only. Calls modules. Protects API keys server-side.

---

## Project Structure

```
app/                          # Next.js App Router — thin route wrappers only
├── api/
│   ├── auth/[...all]/        # Better Auth handler
│   ├── geocoding/            # City autocomplete (OpenWeather Geo API)
│   ├── weather/current/      # Current weather + solar + recommendations
│   ├── weather/forecast/     # 3-day forecast
│   └── favorites/            # CRUD favorites (auth required)
src/
├── screens/                  # One folder per page, max 200 lines
│   ├── home/
│   ├── details/
│   ├── favorites/
│   └── login/
├── modules/                  # Business logic — NO UI
│   ├── weather/              # OpenWeather API client + mapper + utils
│   ├── solar/                # suncalc sunrise/sunset calculator
│   ├── recommendations/      # Rule-based outfit/activity/health suggestions
│   ├── favorites/            # Prisma DB operations
│   └── geocoding/            # City search autocomplete
├── ui/                       # Reusable components
│   ├── header/
│   ├── footer/
│   ├── search-bar/           # Autocomplete with keyboard navigation
│   └── weather-map/          # Leaflet map with OpenWeather tile layers
├── stores/
│   └── weather-store/        # MobX: weather, forecast, favorites, search
├── hooks/
│   ├── use-debounce.ts
│   └── use-city-search.ts
├── lib/
│   ├── auth.ts               # Better Auth server config (Google OAuth)
│   ├── auth-client.ts        # Better Auth client (useSession, signIn, signOut)
│   ├── axios.ts              # Axios instance
│   ├── constants.ts          # API_ENDPOINTS, OPENWEATHER_BASE_URL
│   ├── messages.ts           # All user-facing strings (API errors, recommendations)
│   ├── prisma.ts             # Prisma singleton
│   ├── weather-cache.ts      # unstable_cache wrappers (10-min TTL)
│   └── weather-icons.ts      # conditionCode → Material Symbol icon name
└── types/                    # Shared TypeScript interfaces
```

---

## Coding Rules

### Files
- Max **200 lines** per file — decompose into `components/` subfolder
- **kebab-case** for all filenames
- Each folder has an `index.ts` barrel export

### Strings
- All user-facing strings in constants files (`*.constants.ts` or `src/lib/messages.ts`)
- Never hardcode strings directly in JSX

### Imports
```typescript
// ✅ Screen reads from Store
import { useWeatherStore } from "@/src/stores/provider";

// ✅ Store calls Module
import { fetchCurrentWeather } from "@/src/modules/weather";

// ❌ Screen must NOT import from modules directly
```

### Destructuring
- Always destructure objects before use — avoid repeated `obj.prop.subprop`
- Destructure API_ERRORS at top of file: `const { UNAUTHORIZED } = API_ERRORS;`

### Styling
- Tailwind only — never hardcode hex colors in JSX
- Glassmorphism helpers: `glass-card`, `glass-card-heavy`, `glass-card-sm` (in `globals.css`)
- Design tokens in `tailwind.config.ts` (sourced from `DESIGN.md`)

### State
- MobX `flow()` for all async actions in Store
- Screens use `observer()` from `mobx-react-lite`
- No `useState` for server data — use Store

---

## Key Modules

### `src/modules/weather/`
- `weather.api.ts` — `fetchCurrentWeather(city)`, `fetchForecast(city)` via Axios
- `weather.mapper.ts` — maps OpenWeather response → `WeatherData` type, calculates dew point
- `weather.utils.ts` — `groupForecastByDay()`, `calcDewPoint()`
- `validation.ts` — Zod schemas for OpenWeather API responses

### `src/modules/solar/`
- `getSolarData(lat, lon, date, timezoneOffsetSeconds)` using `suncalc`
- Returns `{ sunrise, sunset, daylightDuration, twilightDuration }` in local time

### `src/modules/recommendations/`
- `getRecommendations(input)` → `{ outfit, activity, health }`
- Rules: temp ranges, condition codes, UV index, humidity, wind speed
- All text in `src/lib/messages.ts` → `RECOMMENDATION_MESSAGES`

### `src/lib/weather-cache.ts`
- `getCachedCurrentWeather(city)` — 10-min cache via `unstable_cache`
- `getCachedForecast(city)` — 10-min cache via `unstable_cache`
- `getCacheHeaders(_fetchedAt)` — returns `X-Cache` / `X-Cache-Age` headers

---

## Auth

- **Provider:** Better Auth with Google OAuth
- **Protected routes:** `/favorites` — checked in `app/favorites/page.tsx` via `auth.api.getSession()`
- **Client:** `useSession()`, `signIn.social()`, `signOut()` from `src/lib/auth-client.ts`
- Never check auth in `src/screens/` — only in page Server Components or Route Handlers

---

## Database (Prisma + PostgreSQL)

Key models:
- `User` — Better Auth user
- `Session`, `Account`, `Verification` — Better Auth internals
- `Favorite` — `city_name`, `userId`, `lat`, `lon`, `timezone`
- `SearchHistory` — `search_term`, `userId` (optional)

---

## Quality Checks

Run before every commit:
```bash
pnpm lint        # ESLint — zero warnings
pnpm typecheck   # TypeScript strict
pnpm test        # Vitest unit tests (16 tests)
pnpm format      # Prettier
```
