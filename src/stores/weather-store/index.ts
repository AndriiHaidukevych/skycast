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
import type { FavoriteCity } from "@/src/types/favorites";

interface AddFavoritePayload {
  city_name: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
}

class WeatherStore {
  currentCity: string | null = null;
  currentWeather: WeatherData | null = null;
  recommendations: Recommendations | null = null;
  forecast: ForecastDay[] = [];
  searchQuery = "";
  isLoading = false;
  error: string | null = null;

  favorites: FavoriteCity[] = [];
  isLoadingFavorites = false;

  constructor() {
    makeAutoObservable(this, {
      fetchWeather: flow,
      fetchForecast: flow,
      loadFavorites: flow,
      addFavorite: flow,
      removeFavorite: flow,
    });
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  clearError() {
    this.error = null;
  }

  isFavorite(cityName: string): boolean {
    return this.favorites.some((f) => f.city_name.toLowerCase() === cityName.toLowerCase());
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
      // non-critical, fail silently
    }
  }

  *loadFavorites() {
    this.isLoadingFavorites = true;
    try {
      const { data } = yield apiClient.get<{ favorites: FavoriteCity[] }>(
        API_ENDPOINTS.FAVORITES.LIST
      );
      this.favorites = data.favorites;

      // Fetch weather for each favorite in parallel
      yield Promise.all(
        this.favorites.map(async (fav) => {
          try {
            const { data: wd } = await apiClient.get<CurrentWeatherResponse>(
              API_ENDPOINTS.WEATHER.CURRENT,
              { params: { city: fav.city_name } }
            );
            const { temp, description, conditionCode } = wd.weather;
            fav.weather = { temp, description, conditionCode };
          } catch {
            // weather unavailable for this city
          }
        })
      );
    } catch {
      // user may not be authenticated
    } finally {
      this.isLoadingFavorites = false;
    }
  }

  *addFavorite(payload: AddFavoritePayload) {
    try {
      yield apiClient.post(API_ENDPOINTS.FAVORITES.LIST, payload);
      this.loadFavorites();
    } catch {
      // handle silently
    }
  }

  *removeFavorite(id: string) {
    try {
      yield apiClient.delete(API_ENDPOINTS.FAVORITES.DELETE(id));
      this.favorites = this.favorites.filter((f) => f.id !== id);
    } catch {
      // handle silently
    }
  }
}

export const weatherStore = new WeatherStore();
export type { WeatherStore };
