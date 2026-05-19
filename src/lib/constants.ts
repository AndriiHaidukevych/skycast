export const API_ENDPOINTS = {
  WEATHER: {
    CURRENT: "/api/weather/current",
    FORECAST: "/api/weather/forecast",
  },
  FAVORITES: {
    LIST: "/api/favorites",
    DELETE: (id: string) => `/api/favorites/${id}`,
  },
} as const;
