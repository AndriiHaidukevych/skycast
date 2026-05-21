"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useWeatherStore } from "@/src/stores/provider";
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3">
        <span className="material-symbols-outlined text-primary animate-spin">
          progress_activity
        </span>
        <span className="font-body-md text-on-surface-variant">{loadingWeather}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-stack-sm text-center px-container-padding-mobile">
        <span className="material-symbols-outlined text-error text-[48px]">cloud_off</span>
        <p className="font-headline-md text-headline-md text-error">{error}</p>
        <button
          onClick={() => store.clearError()}
          className="font-label-caps text-label-caps text-primary hover:underline"
        >
          {tryAgain}
        </button>
      </div>
    );
  }

  if (!currentWeather || !recommendations) {
    return <WelcomeState />;
  }

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
