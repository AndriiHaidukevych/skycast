# SkyCast — Agent Instructions

Architecture, conventions, and rules for AI agents working on this codebase.

## Architecture: MVVM + Service Layer

```
View       →  src/screens/ + src/ui/
ViewModel  →  src/stores/
Service    →  src/services/        ← abstractions (interfaces + singletons)
Model      →  src/modules/
```

**Data flow (one direction only):**

```
OpenWeather API → Route Handler → weatherServerService → modules
                                                          ↓
Browser ← View ← ViewModel (MobX Store) ← weatherClientService ← /api/*
```

**Layer rules:**

- `src/screens/` — UI only. No direct API calls. Reads from MobX store or passes props down.
- `src/stores/` — MobX `makeAutoObservable`. Calls Service interfaces, not `apiClient` directly.
- `src/services/` — Interfaces + singleton implementations. Client services call `/api/*`, server services call modules.
- `src/modules/` — Pure business logic. No UI. No MobX. No HTTP.
- `app/api/` — Route Handlers only. Call server services or modules. Protect API keys server-side.

---

## Project Structure

```
app/                          # Next.js App Router — thin route wrappers only
├── api/
│   ├── auth/[...all]/        # Better Auth handler
│   ├── geocoding/            # City autocomplete
│   ├── weather/current/      # Current weather + solar + recommendations (cached)
│   ├── weather/forecast/     # 3-day forecast (cached)
│   ├── search-history/       # Save/get recent searches
│   └── favorites/            # CRUD favorites (auth required)
src/
├── screens/                  # View — UI logic, max 200 lines
│   ├── home/
│   ├── details/
│   ├── favorites/
│   └── login/
├── modules/                  # Model — business logic, NO UI, NO MobX
│   ├── weather/              # OpenWeather API client + mapper + utils + validation
│   ├── solar/                # suncalc sunrise/sunset calculator
│   ├── recommendations/      # Strategy pattern: OutfitStrategy, ActivityStrategy, HealthStrategy
│   │   └── strategies/
│   ├── favorites/            # Prisma DB operations (used by Route Handlers)
│   ├── geocoding/            # Geocoding API client + Zod validation
│   └── search-history/       # Prisma search history DB operations
├── services/                 # Service interfaces + singletons (DIP)
│   ├── weather.client.service.ts   # IWeatherClientService (calls /api/weather/*)
│   ├── weather.server.service.ts   # IWeatherServerService (orchestrates modules, server-only)
│   ├── geocoding.service.ts        # IGeocodingService (calls /api/geocoding)
│   ├── search-history.service.ts   # ISearchHistoryService (calls /api/search-history)
│   └── favorites.service.ts        # IFavoritesService (calls /api/favorites)
├── stores/                   # ViewModel — MobX stores
│   ├── weather-store/        # WeatherStore: weather + forecast
│   ├── favorites-store/      # FavoritesStore: favorites + search history
│   └── provider.tsx          # StoreProvider, useWeatherStore(), useFavoritesStore()
├── ui/                       # Reusable View primitives
│   ├── header/
│   ├── footer/
│   ├── search-bar/           # Autocomplete + recent searches (history via props)
│   ├── weather-map/          # Leaflet map with OpenWeather tile layers
│   └── states/               # LoadingState, ErrorState (reusable across screens)
├── hooks/
│   ├── use-debounce.ts
│   └── use-city-search.ts    # Debounced geocoding via IGeocodingService
├── lib/
│   ├── auth.ts               # Better Auth server config (Google OAuth)
│   ├── auth-client.ts        # Better Auth client (useSession, signIn, signOut)
│   ├── axios.ts              # Axios instance (single HTTP client)
│   ├── constants.ts          # API_ENDPOINTS, OPENWEATHER_BASE_URL, getOpenWeatherIconUrl(), getOpenWeatherTileUrl()
│   ├── messages.ts           # All user-facing strings (API errors, recommendations)
│   ├── prisma.ts             # Prisma singleton
│   ├── weather-cache.ts      # unstable_cache wrappers — delegates to IWeatherServerService
│   └── weather-icons.ts      # conditionCode → Material Symbol icon name
└── types/                    # Shared TypeScript interfaces
    ├── weather.ts             # WeatherBase, AtmosphericData, SolarData, WeatherData (intersection)
    ├── favorites.ts
    └── geocoding.ts
```

---

## SOLID

- **S** — `WeatherStore` (weather/forecast) and `FavoritesStore` (favorites/history) are separate
- **O** — Recommendations use Strategy pattern — add `NewStrategy implements IRecommendationStrategy`, register in engine, done
- **L** — TypeScript strict mode enforces type compatibility
- **I** — `WeatherData = WeatherBase & AtmosphericData & SolarData` — components accept only what they need
- **D** — Stores depend on service interfaces (`IWeatherClientService`), not on concrete `apiClient`

---

## Coding Rules

### Files

- Max **200 lines** per file — decompose into `components/` subfolder
- **kebab-case** for all filenames
- Each folder has an `index.ts` barrel export

### Strings

- All user-facing strings in `*.constants.ts` files or `src/lib/messages.ts`
- Never hardcode strings directly in JSX

### Imports

```typescript
// ✅ Screen reads from Store
import { useWeatherStore, useFavoritesStore } from "@/src/stores/provider";

// ✅ Store depends on Service interface
import { weatherClientService } from "@/src/services/weather.client.service";

// ✅ Service calls API endpoint via apiClient
import { apiClient } from "@/src/lib/axios";

// ❌ Screen must NOT call apiClient or modules directly
```

### Recommendations (Strategy Pattern)

Adding a new recommendation type requires **only a new file**:

```typescript
// src/modules/recommendations/strategies/packing.strategy.ts
export class PackingStrategy implements IRecommendationStrategy {
  recommend(input: RecommendationInput): Recommendation { ... }
}
// Then register in index.ts:
engine.register("packing", new PackingStrategy());
```

### Loading / Error states

Use shared components from `src/ui/states/`:

```typescript
import { LoadingState, ErrorState } from "@/src/ui/states";

if (isLoading) return <LoadingState message="Loading weather…" />;
if (error) return <ErrorState message={error} onRetry={retry} />;
```

### Styling

- Tailwind only — never hardcode hex colors in JSX
- Design tokens in `tailwind.config.ts` (sourced from `DESIGN.md`)
- Glassmorphism: `glass-card`, `glass-card-heavy`, `glass-card-sm` (in `globals.css`)

### State

- MobX `flow()` for all async actions in Store
- Screens use `observer()` from `mobx-react-lite`
- `runInAction()` when mutating observable inside `async` callback

---

## Key Modules

### `src/modules/recommendations/`

Strategy pattern via `RecommendationEngine`:

- `recommendation.engine.ts` — register/run strategies
- `recommendation.strategy.ts` — `IRecommendationStrategy` interface
- `strategies/outfit.strategy.ts`, `activity.strategy.ts`, `health.strategy.ts`
- `weather.predicates.ts` — shared `isRainy()`, `isStormy()`

### `src/modules/weather/`

- `weather.api.ts` — `fetchCurrentWeather()`, `fetchForecast()` via Axios
- `weather.mapper.ts` — maps OpenWeather → `WeatherData`, calculates dew point
- `weather.utils.ts` — `groupForecastByDay()`, `calcDewPoint()`
- `validation.ts` — Zod schemas

### `src/lib/weather-cache.ts`

- `getCachedCurrentWeather(city)` — delegates to `weatherServerService`, 10-min TTL
- `getCachedForecast(city)` — delegates to `weatherServerService`, 10-min TTL
- `getCacheHeaders(_fetchedAt)` — `X-Cache: HIT/MISS`, `X-Cache-Age: Xs`

---

## Auth

- **Provider:** Better Auth with Google OAuth
- **Protected routes:** `/favorites` — `auth.api.getSession()` in the page Server Component
- **Client:** `useSession()`, `signIn.social()`, `signOut()` from `src/lib/auth-client.ts`
- No middleware — auth checked directly in page Server Components

---

## Database (Prisma + PostgreSQL)

- `User`, `Session`, `Account`, `Verification` — Better Auth internals
- `Favorite` — `city_name`, `userId`, `lat`, `lon`, `timezone`, `createdAt`
- `SearchHistory` — `search_term`, `userId` (optional), `timestamp`

---

## Quality Checks

```bash
pnpm lint        # ESLint — zero warnings
pnpm typecheck   # TypeScript strict
pnpm test        # Vitest (16 tests)
pnpm format      # Prettier
```
