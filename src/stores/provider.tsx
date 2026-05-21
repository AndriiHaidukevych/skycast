"use client";

import { createContext, useContext } from "react";
import { weatherStore } from "./weather-store";
import { favoritesStore } from "./favorites-store";
import type { WeatherStore } from "./weather-store";
import type { FavoritesStore } from "./favorites-store";

const WeatherStoreContext = createContext<WeatherStore>(weatherStore);
const FavoritesStoreContext = createContext<FavoritesStore>(favoritesStore);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <WeatherStoreContext.Provider value={weatherStore}>
      <FavoritesStoreContext.Provider value={favoritesStore}>
        {children}
      </FavoritesStoreContext.Provider>
    </WeatherStoreContext.Provider>
  );
}

export function useWeatherStore(): WeatherStore {
  return useContext(WeatherStoreContext);
}

export function useFavoritesStore(): FavoritesStore {
  return useContext(FavoritesStoreContext);
}
