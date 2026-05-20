"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useWeatherStore } from "@/src/stores/provider";
import {
  WeatherDetailCard,
  SolarCycleCard,
  RecommendationCards,
  VisibilitySection,
} from "./components";
import { WeatherMapWidget } from "@/src/ui/weather-map";
import { DETAILS_MESSAGES } from "./details.constants";

interface Props {
  city: string;
}

const { loading, notFound, tryAgain } = DETAILS_MESSAGES;

export const DetailsScreen = observer(function DetailsScreen({ city }: Props) {
  const store = useWeatherStore();
  const { currentWeather, recommendations, isLoading, error, currentCity } = store;
  const isFav = store.isFavorite(city);

  useEffect(() => {
    if (currentCity !== city) {
      store.fetchWeather(city);
    }
    store.loadFavorites();
  }, [city, currentCity, store]);

  function handleToggleFavorite() {
    if (!currentWeather) return;
    if (isFav) {
      const fav = store.favorites.find((f) => f.city_name.toLowerCase() === city.toLowerCase());
      if (fav) store.removeFavorite(fav.id);
    } else {
      const { city: cityName, country, lat, lon, timezone } = currentWeather;
      store.addFavorite({ city_name: cityName, country, lat, lon, timezone });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3">
        <span className="material-symbols-outlined text-primary animate-spin">
          progress_activity
        </span>
        <span className="font-body-md text-on-surface-variant">{loading}</span>
      </div>
    );
  }

  if (error || !currentWeather || !recommendations) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-stack-sm text-center px-container-padding-mobile">
        <span className="material-symbols-outlined text-error text-[48px]">cloud_off</span>
        <p className="font-headline-md text-headline-md text-error">{error ?? notFound}</p>
        <button
          onClick={() => store.fetchWeather(city)}
          className="font-label-caps text-label-caps text-primary hover:underline"
        >
          {tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "radial-gradient(circle at 50% -20%, #1e293b 0%, #0b1326 100%)" }}
    >
      <main className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg space-y-stack-lg">
        {/* Main weather + solar row */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-stack-md">
          <WeatherDetailCard
            weather={currentWeather}
            isFav={isFav}
            onToggleFavorite={handleToggleFavorite}
          />
          <SolarCycleCard weather={currentWeather} />
        </section>

        <RecommendationCards recommendations={recommendations} />
        <VisibilitySection weather={currentWeather} />

        <WeatherMapWidget
          lat={currentWeather.lat}
          lon={currentWeather.lon}
          city={currentWeather.city}
        />
      </main>
    </div>
  );
});
