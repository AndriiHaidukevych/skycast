"use client";

import { SearchBar } from "@/src/ui/search-bar";
import { useWeatherStore } from "@/src/stores/provider";
import { HOME_MESSAGES } from "../home.constants";
import type { GeocodingResult } from "@/src/types/geocoding";

const { searchAnotherCity } = HOME_MESSAGES;

export function CitySearchBar() {
  const store = useWeatherStore();

  function handleSelect({ name }: GeocodingResult) {
    store.fetchWeather(name);
  }

  return (
    <div className="flex items-center gap-3">
      <SearchBar
        onSelect={handleSelect}
        placeholder={searchAnotherCity}
        className="flex-1 max-w-sm"
      />
    </div>
  );
}
