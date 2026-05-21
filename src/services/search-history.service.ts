import { apiClient } from "@/src/lib/axios";

export interface ISearchHistoryService {
  getRecent(): Promise<string[]>;
  save(term: string): Promise<void>;
}

export const searchHistoryService: ISearchHistoryService = {
  async getRecent() {
    const { data } = await apiClient.get<{ searches: string[] }>("/api/search-history");
    return data.searches;
  },

  async save(term) {
    await apiClient.post("/api/search-history", { searchTerm: term });
  },
};
