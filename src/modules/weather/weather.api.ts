import axios from "axios";
import { OPENWEATHER_BASE_URL } from "@/src/lib/constants";
import { API_ERRORS } from "@/src/lib/messages";
import { OpenWeatherCurrentSchema, OpenWeatherForecastSchema } from "./validation";
import type { OpenWeatherCurrent, OpenWeatherForecast } from "./validation";
import { WeatherApiError } from "./weather.types";

const { CITY_NOT_FOUND, WEATHER_FETCH_FAILED, FORECAST_FETCH_FAILED } = API_ERRORS;

function buildUrl(path: string, params: Record<string, string>): string {
  const url = new URL(`${OPENWEATHER_BASE_URL}${path}`);
  url.searchParams.set("appid", process.env.OPENWEATHER_API_KEY!);
  url.searchParams.set("units", "metric");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return url.toString();
}

export async function fetchCurrentWeather(city: string): Promise<OpenWeatherCurrent> {
  try {
    const { data } = await axios.get(buildUrl("/data/2.5/weather", { q: city }));
    return OpenWeatherCurrentSchema.parse(data);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      throw new WeatherApiError(CITY_NOT_FOUND(city), 404);
    }
    throw new WeatherApiError(WEATHER_FETCH_FAILED);
  }
}

export async function fetchForecast(city: string): Promise<OpenWeatherForecast> {
  try {
    const { data } = await axios.get(buildUrl("/data/2.5/forecast", { q: city, cnt: "40" }));
    return OpenWeatherForecastSchema.parse(data);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      throw new WeatherApiError(CITY_NOT_FOUND(city), 404);
    }
    throw new WeatherApiError(FORECAST_FETCH_FAILED);
  }
}
