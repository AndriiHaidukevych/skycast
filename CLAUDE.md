# SkyCast — Architecture & Conventions

## Architecture: MVVM

This project follows the **MVVM (Model-View-ViewModel)** pattern enforced through strict layer boundaries.

```
View       →  src/screens/ + src/ui/
ViewModel  →  src/stores/
Model      →  src/modules/
```

### Layer Rules

| Layer | Location | Rules |
|-------|----------|-------|
| **View** | `src/screens/`, `src/ui/` | Only reads from ViewModel (Store). No direct module calls. No API calls. |
| **ViewModel** | `src/stores/` | MobX `makeAutoObservable`. Calls Model functions. Exposes observable state and actions to View. |
| **Model** | `src/modules/` | Pure business logic. No UI imports. No MobX. Returns typed data. |

**Data flow — one direction only:**
```
OpenWeather API → Route Handler → Model (modules/) → ViewModel (stores/) → View (screens/)
```

### SOLID Principles

- **S** — Each module owns exactly one domain (`weather`, `solar`, `recommendations`, `favorites`, `auth`)
- **O** — Add new modules without touching existing ones
- **L** — TypeScript strict mode enforces type compatibility across layers
- **I** — Each module exports only what callers need (no fat interfaces)
- **D** — Screens depend on Store abstractions, never on concrete module functions

---

## Project Structure

```
app/                    # Next.js App Router — routing wrappers ONLY
├── page.tsx            # → import { HomeScreen } from "@/src/screens/home"
├── login/page.tsx
├── details/[city]/page.tsx
├── favorites/page.tsx
└── api/                # Route Handlers (server-side, protect API keys)

src/
├── screens/            # View — UI logic, max 200 lines per file
│   ├── home/
│   ├── details/
│   ├── favorites/
│   └── login/
├── modules/            # Model — business logic, NO UI
│   ├── weather/        # OpenWeather API client
│   ├── solar/          # Sunrise/sunset calculations
│   ├── recommendations/ # Outfit/activity/health rules
│   └── favorites/      # DB operations
├── stores/             # ViewModel — MobX stores
│   └── weather-store/
├── ui/                 # Reusable View primitives (GlassCard, SearchBar…)
├── lib/                # Infrastructure (axios, auth, prisma, constants)
├── hooks/              # Custom React hooks
└── types/              # Shared TypeScript types

prisma/
└── schema.prisma
```

---

## Coding Rules

### Files
- Max **200 lines** per file — decompose into `components/` subfolder
- **kebab-case** for all file names (`weather-card.tsx`, `solar.types.ts`)
- **Barrel exports** — every folder has `index.ts`

### Naming
- Screens: `HomeScreen`, `DetailsScreen` (PascalCase + Screen suffix)
- Stores: `WeatherStore` (PascalCase + Store suffix)
- Modules: plain exports (`getWeather`, `getSolarData`)
- UI components: `GlassCard`, `SearchBar` (PascalCase)

### Imports
```typescript
// ✅ Screen imports from Store
import { useWeatherStore } from "@/src/stores/weather-store";

// ✅ Store imports from Module
import { getCurrentWeather } from "@/src/modules/weather";

// ❌ Screen must NOT import from modules directly
import { getCurrentWeather } from "@/src/modules/weather"; // in a screen = WRONG
```

### Module structure
Each module in `src/modules/<domain>/` follows:
```
weather/
├── index.ts          # Public API (exports only)
├── weather.types.ts  # TypeScript interfaces
├── weather.utils.ts  # Pure helper functions
└── validation.ts     # Zod schemas
```

### Store structure (ViewModel)
```typescript
// src/stores/weather-store/index.ts
class WeatherStore {
  // Observable state
  currentWeather: WeatherData | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() { makeAutoObservable(this); }

  // Actions — call Model functions
  async searchCity(city: string) { ... }
}
```

### Route handlers
- All calls to external APIs (OpenWeather) happen **server-side** in `app/api/`
- Never expose API keys to client
- Route handlers call module functions, return typed JSON

### Styling
- Use Tailwind classes only — never hardcode hex colors in JSX
- All design tokens come from `tailwind.config.ts` (sourced from `DESIGN.md`)
- Glassmorphism helpers: `glass-card`, `glass-card-heavy`, `glass-card-sm` (defined in `globals.css`)

---

## Quality Checks (run before every commit)

```bash
pnpm lint       # ESLint — zero warnings allowed
pnpm typecheck  # TypeScript strict mode
pnpm test       # Vitest unit tests
pnpm format     # Prettier
```

---

## Auth

- **Better Auth** with Google OAuth
- Protected routes: `/favorites` (middleware redirects to `/login`)
- Server-side session: `auth.api.getSession()` in Route Handlers
- Client-side session: `useSession()` from `@/src/lib/auth-client`
- Never check auth in `src/screens/` — use middleware or Route Handler
