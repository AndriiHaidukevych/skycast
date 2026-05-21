import { apiClient } from "@/src/lib/axios";
import { API_ENDPOINTS } from "@/src/lib/constants";
import type { GeocodingResult } from "@/src/types/geocoding";

export interface IGeocodingService {
  search(query: string): Promise<GeocodingResult[]>;
}

export const geocodingService: IGeocodingService = {
  async search(query) {
    const { data } = await apiClient.get<{ results: GeocodingResult[] }>(API_ENDPOINTS.GEOCODING, {
      params: { q: query },
    });
    return data.results;
  },
};
