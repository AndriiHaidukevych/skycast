import { apiClient } from "@/src/lib/axios";
import { API_ENDPOINTS } from "@/src/lib/constants";
import type { CurrentWeatherResponse, ForecastResponse } from "@/src/types/weather";

export interface IWeatherClientService {
  getCurrentWeather(city: string): Promise<CurrentWeatherResponse>;
  getForecast(city: string): Promise<ForecastResponse>;
}

export const weatherClientService: IWeatherClientService = {
  async getCurrentWeather(city) {
    const { data } = await apiClient.get<CurrentWeatherResponse>(API_ENDPOINTS.WEATHER.CURRENT, {
      params: { city },
    });
    return data;
  },

  async getForecast(city) {
    const { data } = await apiClient.get<ForecastResponse>(API_ENDPOINTS.WEATHER.FORECAST, {
      params: { city },
    });
    return data;
  },
};
