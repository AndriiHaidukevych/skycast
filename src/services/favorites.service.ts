import { apiClient } from "@/src/lib/axios";
import { API_ENDPOINTS } from "@/src/lib/constants";
import type { FavoriteCity } from "@/src/types/favorites";
import type { CurrentWeatherResponse } from "@/src/types/weather";

export interface AddFavoritePayload {
  city_name: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
}

export interface IFavoritesService {
  getAll(): Promise<FavoriteCity[]>;
  add(payload: AddFavoritePayload): Promise<void>;
  remove(id: string): Promise<void>;
  getWeatherForCity(
    city: string
  ): Promise<{ temp: number; description: string; conditionCode: number }>;
}

export const favoritesService: IFavoritesService = {
  async getAll() {
    const { data } = await apiClient.get<{ favorites: FavoriteCity[] }>(
      API_ENDPOINTS.FAVORITES.LIST
    );
    return data.favorites;
  },

  async add(payload) {
    await apiClient.post(API_ENDPOINTS.FAVORITES.LIST, payload);
  },

  async remove(id) {
    await apiClient.delete(API_ENDPOINTS.FAVORITES.DELETE(id));
  },

  async getWeatherForCity(city) {
    const { data } = await apiClient.get<CurrentWeatherResponse>(API_ENDPOINTS.WEATHER.CURRENT, {
      params: { city },
    });
    const { temp, description, conditionCode } = data.weather;
    return { temp, description, conditionCode };
  },
};
