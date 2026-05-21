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

export const getOpenWeatherIconUrl = (icon: string) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

export const getOpenWeatherTileUrl = (layer: string) =>
  `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`;

export const MAX_SEARCH_HISTORY = 5;
