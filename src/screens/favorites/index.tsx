"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useFavoritesStore } from "@/src/stores/provider";
import { LoadingState } from "@/src/ui/states";
import { CityCard, AddLocationCard, RegionFilter, DailyInsight } from "./components";
import { FAVORITES_MESSAGES, getRegion } from "./favorites.constants";
import type { RegionId } from "./favorites.constants";

const { title, subtitle, searchPlaceholder, loading, noFavorites, noFavoritesHint } =
  FAVORITES_MESSAGES;

export const FavoritesScreen = observer(function FavoritesScreen() {
  const favStore = useFavoritesStore();
  const { favorites, isLoadingFavorites } = favStore;
  const [search, setSearch] = useState("");
  const [activeRegion, setActiveRegion] = useState<RegionId>("ALL");

  useEffect(() => {
    favStore.loadFavorites();
  }, [favStore]);

  const filtered = favorites.filter((f) => {
    const matchesSearch =
      f.city_name.toLowerCase().includes(search.toLowerCase()) ||
      f.country.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = activeRegion === "ALL" || getRegion(f.country) === activeRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
      {/* Header */}
      <section className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2">
          {title}
        </h1>
        <p className="font-body-md text-on-surface-variant max-w-2xl">{subtitle}</p>
      </section>

      {/* Search + Filter */}
      <div className="mb-stack-md flex flex-col md:flex-row gap-gutter items-start md:items-center">
        <div className="relative w-full md:max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-highest/20 border border-white/10 rounded-xl focus:outline-none focus:border-white/40 font-body-md text-on-surface placeholder:text-on-surface-variant transition-all"
          />
        </div>
        <RegionFilter active={activeRegion} onChange={setActiveRegion} />
      </div>

      {isLoadingFavorites && <LoadingState message={loading} fullPage={false} />}

      {/* Empty state */}
      {!isLoadingFavorites && favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-stack-lg gap-stack-sm text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[64px]">
            star_border
          </span>
          <p className="font-headline-md text-headline-md text-on-surface-variant">{noFavorites}</p>
          <p className="font-body-md text-on-surface-variant/60">{noFavoritesHint}</p>
        </div>
      )}

      {/* Grid */}
      {!isLoadingFavorites && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {filtered.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
          <AddLocationCard />
        </div>
      )}

      {/* Daily Insight */}
      {favorites.length > 1 && <DailyInsight favorites={favorites} />}
    </div>
  );
});
