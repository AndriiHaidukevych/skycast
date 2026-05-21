export const HOME_MESSAGES = {
  loadingWeather: "Loading weather data…",
  tryAgain: "Try again",

  welcomeTitle: "What's the weather like?",
  welcomeSubtitle:
    "Search for any city to get real-time weather, forecasts, and personalized recommendations.",
  searchPlaceholder: "Search cities...",

  currentLocation: "Current Location",
  uvIndexLabel: "UV INDEX",
  outfitLabel: "OUTFIT TODAY",
  viewFullDetails: "View full details",

  backToSearch: "Back to search",
  searchAnotherCity: "Search another city...",
  forecastTitle: "3-Day Forecast",
  forecastSlots: ["Morning", "Afternoon", "Evening"] as const,
} as const;

export const UV_LABELS = {
  veryHigh: "Very High",
  high: "High",
  moderate: "Moderate",
  low: "Low",
} as const;

export const STATS_LABELS = {
  humidity: "HUMIDITY",
  pressure: "PRESSURE",
  visibility: "VISIBILITY",
  sunset: "SUNSET",
} as const;
