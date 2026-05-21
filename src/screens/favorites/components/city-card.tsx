"use client";

import Link from "next/link";
import { observer } from "mobx-react-lite";
import { useFavoritesStore } from "@/src/stores/provider";
import type { FavoriteCity } from "@/src/types/favorites";
import { getLocalTime } from "../favorites.constants";
import { getConditionIcon } from "@/src/lib/weather-icons";

interface Props {
  city: FavoriteCity;
}

export const CityCard = observer(function CityCard({ city }: Props) {
  const store = useFavoritesStore();
  const { id, city_name, country, timezone, weather } = city;

  const localTime = getLocalTime(Number(timezone));

  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    store.removeFavorite(id);
  }

  return (
    <Link
      href={`/details/${encodeURIComponent(city_name)}`}
      className="glass-card p-6 rounded-xl flex flex-col justify-between h-64 relative overflow-hidden group transition-all hover:bg-white/10"
    >
      <button
        onClick={handleRemove}
        className="absolute top-3 right-3 z-10 text-secondary hover:text-error transition-colors"
        title="Remove from favorites"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
      </button>

      <div>
        <p className="font-label-caps text-label-caps text-primary mb-1">LOCAL TIME: {localTime}</p>
        <h2 className="font-headline-md text-headline-md">{city_name}</h2>
        <p className="font-body-md text-on-surface-variant">{country}</p>
      </div>

      <div className="flex justify-between items-end">
        {weather ? (
          <>
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {weather.temp}°
            </span>
            <div className="flex flex-col items-end">
              <span className="material-symbols-outlined text-primary text-5xl mb-1">
                {getConditionIcon(weather.conditionCode)}
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant capitalize">
                {weather.description}
              </span>
            </div>
          </>
        ) : (
          <span className="font-body-md text-on-surface-variant">Loading…</span>
        )}
      </div>
    </Link>
  );
});
