import { unstable_cache } from "next/cache";
import { weatherServerService, WeatherApiError } from "@/src/services/weather.server.service";

const CACHE_TTL_SECONDS = 600;

export const getCachedCurrentWeather = unstable_cache(
  (city: string) => weatherServerService.getCurrentWeather(city),
  ["weather-current"],
  { revalidate: CACHE_TTL_SECONDS }
);

export const getCachedForecast = unstable_cache(
  (city: string) => weatherServerService.getForecast(city),
  ["weather-forecast"],
  { revalidate: CACHE_TTL_SECONDS }
);

export function getCacheHeaders(_fetchedAt: number) {
  const ageSeconds = Math.round((Date.now() - _fetchedAt) / 1000);
  const status = ageSeconds > 2 ? "HIT" : "MISS";
  return {
    "X-Cache": status,
    "X-Cache-Age": `${ageSeconds}s`,
  };
}

export { WeatherApiError };
