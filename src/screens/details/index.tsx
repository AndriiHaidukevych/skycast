"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useWeatherStore, useFavoritesStore } from "@/src/stores/provider";
import {
  WeatherDetailCard,
  SolarCycleCard,
  RecommendationCards,
  VisibilitySection,
} from "./components";
import { WeatherMapWidget } from "@/src/ui/weather-map";
import { LoadingState, ErrorState } from "@/src/ui/states";
import { DETAILS_MESSAGES } from "./details.constants";

interface Props {
  city: string;
}

const { loading, notFound, tryAgain } = DETAILS_MESSAGES;

export const DetailsScreen = observer(function DetailsScreen({ city }: Props) {
  const store = useWeatherStore();
  const favStore = useFavoritesStore();
  const { currentWeather, recommendations, isLoading, error, currentCity } = store;
  const isFav = favStore.isFavorite(city);

  useEffect(() => {
    if (currentCity !== city) {
      store.fetchWeather(city);
    }
    favStore.loadFavorites();
  }, [city, currentCity, store, favStore]);

  function handleToggleFavorite() {
    if (!currentWeather) return;
    if (isFav) {
      const fav = favStore.favorites.find((f) => f.city_name.toLowerCase() === city.toLowerCase());
      if (fav) favStore.removeFavorite(fav.id);
    } else {
      const { city: cityName, country, lat, lon, timezone } = currentWeather;
      favStore.addFavorite({ city_name: cityName, country, lat, lon, timezone });
    }
  }

  if (isLoading) return <LoadingState message={loading} />;

  if (error || !currentWeather || !recommendations) {
    return (
      <ErrorState
        message={error ?? notFound}
        onRetry={() => store.fetchWeather(city)}
        retryLabel={tryAgain}
      />
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
