import { fetchCurrentWeather, mapToWeatherData, WeatherApiError } from "@/src/modules/weather";
import { fetchForecast } from "@/src/modules/weather";
import { getSolarData } from "@/src/modules/solar";
import { getRecommendations } from "@/src/modules/recommendations";
import { groupForecastByDay } from "@/src/modules/weather/weather.utils";
import type { CurrentWeatherResponse, ForecastResponse } from "@/src/types/weather";

export interface IWeatherServerService {
  getCurrentWeather(city: string): Promise<CurrentWeatherResponse & { _fetchedAt: number }>;
  getForecast(city: string): Promise<ForecastResponse & { _fetchedAt: number }>;
}

export const weatherServerService: IWeatherServerService = {
  async getCurrentWeather(city) {
    const raw = await fetchCurrentWeather(city);
    const {
      coord: { lat, lon },
      timezone,
    } = raw;
    const solar = getSolarData(lat, lon, new Date(), timezone);
    const weather = mapToWeatherData(raw, solar);
    const { temp, conditionCode, windSpeed, uvIndex, humidity } = weather;
    const recommendations = getRecommendations({
      temp,
      conditionCode,
      windSpeed,
      uvIndex,
      humidity,
    });
    return { weather, recommendations, _fetchedAt: Date.now() };
  },

  async getForecast(city) {
    const raw = await fetchForecast(city);
    const {
      city: { timezone },
    } = raw;
    const forecast = groupForecastByDay(raw, timezone);
    return { forecast, _fetchedAt: Date.now() };
  },
};

export { WeatherApiError };
