"use client";

import { useWeatherStore } from "@/src/stores/provider";
import { SearchBar } from "@/src/ui/search-bar";
import { HOME_MESSAGES } from "../home.constants";
import type { GeocodingResult } from "@/src/types/geocoding";

export function WelcomeState() {
  const store = useWeatherStore();
  const { welcomeTitle, welcomeSubtitle, searchPlaceholder } = HOME_MESSAGES;

  function handleSelect({ name }: GeocodingResult) {
    store.fetchWeather(name);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-stack-md text-center px-container-padding-mobile">
      <span className="material-symbols-outlined text-primary text-[72px]">cloud</span>
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">{welcomeTitle}</h1>
        <p className="font-body-md text-on-surface-variant">{welcomeSubtitle}</p>
      </div>
      <SearchBar
        placeholder={searchPlaceholder}
        onSelect={handleSelect}
        className="w-full max-w-md"
        inputClassName="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-10 pr-4 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-all"
      />
    </div>
  );
}
