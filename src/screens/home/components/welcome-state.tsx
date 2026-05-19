"use client";

import { useState } from "react";
import { useWeatherStore } from "@/src/stores/provider";
import { HOME_MESSAGES } from "../home.constants";

export function WelcomeState() {
  const store = useWeatherStore();
  const [query, setQuery] = useState("");
  const { welcomeTitle, welcomeSubtitle, searchPlaceholder } = HOME_MESSAGES;

  function handleSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;
    store.fetchWeather(query.trim());
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-stack-md text-center px-container-padding-mobile">
      <span className="material-symbols-outlined text-primary text-[72px]">cloud</span>
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">{welcomeTitle}</h1>
        <p className="font-body-md text-on-surface-variant">{welcomeSubtitle}</p>
      </div>
      <form onSubmit={handleSearch} className="w-full max-w-md">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </form>
    </div>
  );
}
