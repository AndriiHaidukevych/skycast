export const API_ENDPOINTS = {
  WEATHER: {
    CURRENT: "/api/weather/current",
    FORECAST: "/api/weather/forecast",
  },
  FAVORITES: {
    LIST: "/api/favorites",
    DELETE: (id: string) => `/api/favorites/${id}`,
  },
  GEOCODING: "/api/geocoding",
} as const;

export const OPENWEATHER_BASE_URL = "https://api.openweathermap.org";

export const MAX_SEARCH_HISTORY = 5;
