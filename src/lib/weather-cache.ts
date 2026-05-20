import { unstable_cache } from "next/cache";
import { fetchCurrentWeather, mapToWeatherData, WeatherApiError } from "@/src/modules/weather";
import { fetchForecast } from "@/src/modules/weather";
import { getSolarData } from "@/src/modules/solar";
import { getRecommendations } from "@/src/modules/recommendations";
import { groupForecastByDay } from "@/src/modules/weather/weather.utils";
import type { CurrentWeatherResponse, ForecastResponse } from "@/src/types/weather";

const CACHE_TTL_SECONDS = 600; // 10 minutes

export const getCachedCurrentWeather = unstable_cache(
  async (city: string): Promise<CurrentWeatherResponse & { _fetchedAt: number }> => {
    console.log(`[CACHE MISS] weather:${city}`);

    const raw = await fetchCurrentWeather(city);
    const { coord: { lat, lon }, timezone } = raw;
    const solar = getSolarData(lat, lon, new Date(), timezone);
    const weather = mapToWeatherData(raw, solar);
    const { temp, conditionCode, windSpeed, uvIndex, humidity } = weather;
    const recommendations = getRecommendations({ temp, conditionCode, windSpeed, uvIndex, humidity });

    return { weather, recommendations, _fetchedAt: Date.now() };
  },
  ["weather-current"],
  { revalidate: CACHE_TTL_SECONDS }
);

export const getCachedForecast = unstable_cache(
  async (city: string): Promise<ForecastResponse & { _fetchedAt: number }> => {
    console.log(`[CACHE MISS] forecast:${city}`);

    const raw = await fetchForecast(city);
    const { city: { timezone } } = raw;
    const forecast = groupForecastByDay(raw, timezone);

    return { forecast, _fetchedAt: Date.now() };
  },
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
