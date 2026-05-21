export const DETAILS_MESSAGES = {
  loading: "Loading details…",
  notFound: "City not found",
  tryAgain: "Try again",
  solarTitle: "Solar Cycle",
  sunrise: "SUNRISE",
  sunset: "SUNSET",
  daylight: "DAYLIGHT",
  twilight: "TWILIGHT",
  recommendationsTitle: "Personalized Recommendations",
  latestAnalysis: "LATEST ANALYSIS",
  outfitLabel: "OUTFIT",
  activityLabel: "ACTIVITY",
  healthLabel: "HEALTH",
  visibilityTitle: "Visibility & Precipitation",
  mapLabel: "LIVE WEATHER MAP",
} as const;

export const WEATHER_STAT_LABELS = {
  windSpeed: "WIND SPEED",
  humidity: "HUMIDITY",
  uvIndex: "UV INDEX",
  pressure: "PRESSURE",
  visibility: "VISIBILITY",
  chanceOfRain: "CHANCE OF RAIN",
  dewPoint: "DEW POINT",
  cloudCover: "CLOUD COVER",
} as const;

export const UV_LEVEL_LABELS: Record<string, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  veryHigh: "Very High",
  extreme: "Extreme",
};

export const VISIBILITY_NOTES = {
  visibilityClear: "Clear view.",
  visibilityReduced: "Reduced visibility.",
  rainLikely: "Rain likely.",
  showersIsolated: "Isolated showers possible.",
  dewPointDry: "Dry conditions.",
  dewPointComfort: "Comfortable atmosphere.",
  cloudsClear: "Mostly clear.",
  cloudsPartly: "Partly cloudy.",
  cloudsMostly: "Mostly cloudy.",
} as const;

export function getUvLabel(uvIndex: number): string {
  if (uvIndex >= 11) return `${uvIndex} ${UV_LEVEL_LABELS.extreme}`;
  if (uvIndex >= 8) return `${uvIndex} ${UV_LEVEL_LABELS.veryHigh}`;
  if (uvIndex >= 6) return `${uvIndex} ${UV_LEVEL_LABELS.high}`;
  if (uvIndex >= 3) return `${uvIndex} ${UV_LEVEL_LABELS.moderate}`;
  return `${uvIndex} ${UV_LEVEL_LABELS.low}`;
}
