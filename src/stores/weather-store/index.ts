import { makeAutoObservable, flow } from "mobx";
import { weatherClientService } from "@/src/services/weather.client.service";
import type { IWeatherClientService } from "@/src/services/weather.client.service";
import type { WeatherData, ForecastDay, Recommendations } from "@/src/types/weather";

class WeatherStore {
  currentCity: string | null = null;
  currentWeather: WeatherData | null = null;
  recommendations: Recommendations | null = null;
  forecast: ForecastDay[] = [];
  searchQuery = "";
  isLoading = false;
  error: string | null = null;

  constructor(private readonly service: IWeatherClientService) {
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

  reset() {
    this.currentWeather = null;
    this.recommendations = null;
    this.forecast = [];
    this.currentCity = null;
    this.error = null;
  }

  *fetchWeather(city: string) {
    this.isLoading = true;
    this.error = null;
    try {
      const { weather, recommendations } = yield this.service.getCurrentWeather(city);
      this.currentWeather = weather;
      this.recommendations = recommendations;
      this.currentCity = weather.city;
      this.fetchForecast(weather.city);
    } catch {
      this.error = "Failed to fetch weather data. Please try again.";
    } finally {
      this.isLoading = false;
    }
  }

  *fetchForecast(city: string) {
    try {
      const { forecast } = yield this.service.getForecast(city);
      this.forecast = forecast;
    } catch {
      // non-critical, fail silently
    }
  }
}

export const weatherStore = new WeatherStore(weatherClientService);
export type { WeatherStore };
