import { makeAutoObservable, flow } from "mobx";
import { apiClient } from "@/src/lib/axios";
import { API_ENDPOINTS } from "@/src/lib/constants";
import type {
  WeatherData,
  ForecastDay,
  Recommendations,
  CurrentWeatherResponse,
  ForecastResponse,
} from "@/src/types/weather";

class WeatherStore {
  currentCity: string | null = null;
  currentWeather: WeatherData | null = null;
  recommendations: Recommendations | null = null;
  forecast: ForecastDay[] = [];
  searchQuery = "";
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {
      fetchWeather: flow,
      fetchForecast: flow,
    });
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  clearError() {
    this.error = null;
  }

  *fetchWeather(city: string) {
    this.isLoading = true;
    this.error = null;
    try {
      const { data } = yield apiClient.get<CurrentWeatherResponse>(API_ENDPOINTS.WEATHER.CURRENT, {
        params: { city },
      });
      const { weather, recommendations } = data;
      this.currentWeather = weather;
      this.recommendations = recommendations;
      this.currentCity = weather.city;
      // load forecast in parallel (non-blocking)
      this.fetchForecast(weather.city);
    } catch {
      this.error = "Failed to fetch weather data. Please try again.";
    } finally {
      this.isLoading = false;
    }
  }

  *fetchForecast(city: string) {
    try {
      const { data } = yield apiClient.get<ForecastResponse>(API_ENDPOINTS.WEATHER.FORECAST, {
        params: { city },
      });
      this.forecast = data.forecast;
    } catch {
      // forecast is non-critical, fail silently
    }
  }
}

export const weatherStore = new WeatherStore();
export type { WeatherStore };
