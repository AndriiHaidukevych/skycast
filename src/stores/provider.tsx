"use client";

import { createContext, useContext } from "react";
import { weatherStore } from "./weather-store";
import type { WeatherStore } from "./weather-store";

const WeatherStoreContext = createContext<WeatherStore>(weatherStore);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <WeatherStoreContext.Provider value={weatherStore}>{children}</WeatherStoreContext.Provider>
  );
}

export function useWeatherStore(): WeatherStore {
  return useContext(WeatherStoreContext);
}
