"use client";

import { SearchBar } from "@/src/ui/search-bar";
import { useWeatherStore } from "@/src/stores/provider";
import type { GeocodingResult } from "@/src/types/geocoding";

export function CitySearchBar() {
  const store = useWeatherStore();

  function handleSelect({ name }: GeocodingResult) {
    store.fetchWeather(name);
  }

  return (
    <div className="flex items-center gap-3">
      <SearchBar
        onSelect={handleSelect}
        placeholder="Search another city..."
        className="flex-1 max-w-sm"
      />
    </div>
  );
}
