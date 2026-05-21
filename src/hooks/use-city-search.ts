import { useState, useEffect } from "react";
import { geocodingService } from "@/src/services/geocoding.service";
import { useDebounce } from "./use-debounce";
import type { GeocodingResult } from "@/src/types/geocoding";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

export function useCitySearch(query: string) {
  const trimmed = query.trim();
  const debouncedQuery = useDebounce(trimmed, DEBOUNCE_MS);
  const [results, setResults] = useState<GeocodingResult[]>([]);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) return;

    let cancelled = false;

    geocodingService
      .search(debouncedQuery)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const isActive = debouncedQuery.length >= MIN_QUERY_LENGTH;
  const displayResults = isActive ? results : [];
  const isPending = trimmed !== debouncedQuery && trimmed.length >= MIN_QUERY_LENGTH;
  const isEmpty = isActive && !isPending && results.length === 0;

  function clear() {
    setResults([]);
  }

  return { results: displayResults, isPending, isEmpty, clear };
}
