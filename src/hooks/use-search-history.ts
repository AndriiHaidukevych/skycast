import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/src/lib/axios";
import { MAX_SEARCH_HISTORY } from "@/src/lib/constants";

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    apiClient
      .get<{ searches: string[] }>("/api/search-history")
      .then(({ data }) => setHistory(data.searches))
      .catch(() => {});
  }, []);

  const saveSearch = useCallback((term: string) => {
    apiClient.post("/api/search-history", { searchTerm: term }).catch(() => {});
    setHistory((prev) => [term, ...prev.filter((s) => s !== term)].slice(0, MAX_SEARCH_HISTORY));
  }, []);

  return { history, saveSearch };
}
