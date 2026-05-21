"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useWeatherStore } from "@/src/stores/provider";
import { LoadingState, ErrorState } from "@/src/ui/states";
import { WelcomeState, CurrentWeatherCard, StatsGrid, ForecastSection } from "./components";
import { HOME_MESSAGES } from "./home.constants";

interface Props {
  initialCity?: string;
}

export const HomeScreen = observer(function HomeScreen({ initialCity }: Props) {
  const store = useWeatherStore();
  const { currentWeather, recommendations, forecast, isLoading, error, currentCity } = store;
  const { loadingWeather, tryAgain } = HOME_MESSAGES;

  useEffect(() => {
    if (initialCity && initialCity !== currentCity) {
      store.fetchWeather(initialCity);
    } else if (currentCity && !currentWeather) {
      store.fetchWeather(currentCity);
    }
  }, [initialCity, currentCity, currentWeather, store]);

  if (isLoading) return <LoadingState message={loadingWeather} />;

  if (error) {
    return <ErrorState message={error} onRetry={() => store.clearError()} retryLabel={tryAgain} />;
  }

  if (!currentWeather || !recommendations) return <WelcomeState />;

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "radial-gradient(circle at 20% 30%, #1e3a8a 0%, #0b1326 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg space-y-stack-lg">
        <CurrentWeatherCard weather={currentWeather} recommendations={recommendations} />
        <StatsGrid weather={currentWeather} />
        <ForecastSection forecast={forecast} />
      </div>
    </div>
  );
});
