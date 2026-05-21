# SkyCast — Architecture & Conventions

## Architecture: MVVM + Service Layer

```
View       →  src/screens/ + src/ui/
ViewModel  →  src/stores/
Service    →  src/services/
Model      →  src/modules/
```

### Layer Rules

| Layer         | Location                  | Rules                                                                                        |
| ------------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| **View**      | `src/screens/`, `src/ui/` | Reads from ViewModel. No direct API calls. No module imports.                                |
| **ViewModel** | `src/stores/`             | MobX `makeAutoObservable`. Depends on Service interfaces, not `apiClient`.                   |
| **Service**   | `src/services/`           | Interfaces + singletons. Client services call `/api/*`. Server services orchestrate modules. |
| **Model**     | `src/modules/`            | Pure business logic. No UI. No MobX. No HTTP.                                                |

**Data flow:**

```
OpenWeather API → Route Handler → IWeatherServerService → modules
Browser ← View ← ViewModel (MobX) ← IWeatherClientService ← /api/*
```

### SOLID Principles

- **S** — `WeatherStore` (weather/forecast) and `FavoritesStore` (favorites/history) are separate classes
- **O** — Recommendations use Strategy pattern — add new `*Strategy` class, register in engine, no existing code changes
- **L** — TypeScript strict mode enforces type compatibility
- **I** — `WeatherData = WeatherBase & AtmosphericData & SolarData` — components accept only what they need
- **D** — Stores depend on service interfaces (`IWeatherClientService`), not concrete `apiClient`

---

## Project Structure

```
app/                    # Next.js App Router — routing wrappers ONLY
├── page.tsx            # → HomeScreen
├── login/page.tsx
├── details/[city]/page.tsx
├── favorites/page.tsx  # auth guard via auth.api.getSession()
└── api/                # Route Handlers (server-side, protect API keys)

src/
├── screens/            # View — UI logic, max 200 lines per file
│   ├── home/
│   ├── details/
│   ├── favorites/
│   └── login/
├── modules/            # Model — business logic, NO UI
│   ├── weather/        # weather.api.ts, weather.mapper.ts, weather.utils.ts, validation.ts
│   ├── solar/          # getSolarData() via suncalc
│   ├── recommendations/ # Strategy pattern: engine + OutfitStrategy, ActivityStrategy, HealthStrategy
│   │   └── strategies/
│   ├── favorites/      # Prisma DB ops (used by Route Handlers)
│   ├── geocoding/      # Geocoding API + Zod validation
│   └── search-history/ # Prisma search history ops
├── services/           # DIP — interfaces + singletons
│   ├── weather.client.service.ts   # IWeatherClientService
│   ├── weather.server.service.ts   # IWeatherServerService (server-only)
│   ├── geocoding.service.ts        # IGeocodingService
│   ├── search-history.service.ts   # ISearchHistoryService
│   └── favorites.service.ts        # IFavoritesService
├── stores/             # ViewModel — MobX
│   ├── weather-store/  # WeatherStore: weather + forecast
│   ├── favorites-store/ # FavoritesStore: favorites + search history
│   └── provider.tsx    # StoreProvider, useWeatherStore(), useFavoritesStore()
├── ui/                 # Reusable View primitives
│   ├── header/
│   ├── footer/
│   ├── search-bar/     # Autocomplete + history (history/onSaveSearch as props)
│   ├── weather-map/    # Leaflet + OpenWeather tiles
│   └── states/         # LoadingState, ErrorState
├── lib/
│   ├── auth.ts / auth-client.ts
│   ├── axios.ts        # Single Axios instance
│   ├── constants.ts    # API_ENDPOINTS, getOpenWeatherIconUrl(), getOpenWeatherTileUrl()
│   ├── messages.ts     # All user-facing strings
│   ├── prisma.ts
│   └── weather-cache.ts # unstable_cache wrappers (10-min TTL)
├── hooks/
│   ├── use-debounce.ts
│   └── use-city-search.ts  # Debounced via IGeocodingService
└── types/
    ├── weather.ts      # WeatherBase, AtmosphericData, SolarData, WeatherData
    ├── favorites.ts
    └── geocoding.ts

prisma/
└── schema.prisma
```

---

## Coding Rules

### Files

- Max **200 lines** per file — decompose into `components/` subfolder
- **kebab-case** for all file names
- **Barrel exports** — every folder has `index.ts`

### Naming

- Screens: `HomeScreen` (PascalCase + Screen suffix)
- Stores: `WeatherStore`, `FavoritesStore`
- Services: `weatherClientService` (camelCase singleton)
- Modules: plain function exports (`getRecommendations`, `getSolarData`)
- UI: `LoadingState`, `SearchBar` (PascalCase)

### Imports

```typescript
// ✅ Screen reads from Store
import { useWeatherStore, useFavoritesStore } from "@/src/stores/provider";

// ✅ Store depends on Service interface
import { weatherClientService } from "@/src/services/weather.client.service";

// ✅ Route Handler uses server service or module
import { getCachedCurrentWeather } from "@/src/lib/weather-cache";

// ❌ Screen must NOT import from services or modules directly
```

### Recommendations (OCP — Strategy Pattern)

```typescript
// Add new type — zero changes to existing code:
class PackingStrategy implements IRecommendationStrategy {
  recommend(input): Recommendation { ... }
}
engine.register("packing", new PackingStrategy());
```

### Loading / Error states

```typescript
import { LoadingState, ErrorState } from "@/src/ui/states";

if (isLoading) return <LoadingState message="Loading…" />;
if (isLoading) return <LoadingState message="Loading…" fullPage={false} />; // inline
if (error) return <ErrorState message={error} onRetry={retry} retryLabel="Try again" />;
```

### Styling

- Tailwind only — never hardcode hex colors in JSX
- Design tokens in `tailwind.config.ts` (sourced from `DESIGN.md`)
- Glassmorphism: `glass-card`, `glass-card-heavy`, `glass-card-sm`

### State (MobX)

- `flow()` for async actions in Store
- `observer()` on all screens that read from store
- `runInAction()` when mutating observable inside `async` callback (not in flow)

---

## Auth

- **Provider:** Better Auth + Google OAuth
- **Protected pages:** `app/favorites/page.tsx` — `auth.api.getSession({ headers: await headers() })`
- **Client:** `useSession()`, `signIn.social({ provider: "google" })`, `signOut()` from `src/lib/auth-client.ts`
- No middleware — auth checked in page Server Components directly

---

## Quality Checks (run before every commit)

```bash
pnpm lint       # ESLint — zero warnings allowed
pnpm typecheck  # TypeScript strict mode
pnpm test       # Vitest unit tests (16 tests)
pnpm format     # Prettier
```
