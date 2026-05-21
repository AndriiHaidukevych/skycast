"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/src/ui/search-bar";
import { FAVORITES_MESSAGES } from "../favorites.constants";
import type { GeocodingResult } from "@/src/types/geocoding";

const { addLocation, addLocationSub, addSearchPlaceholder, addCancelButton } = FAVORITES_MESSAGES;

export function AddLocationCard() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function handleSelect({ name }: GeocodingResult) {
    router.push(`/details/${encodeURIComponent(name)}`);
  }

  if (isOpen) {
    return (
      <div className="border-2 border-dashed border-primary/40 p-6 rounded-xl flex flex-col gap-3 justify-center h-64 bg-white/2">
        <SearchBar
          placeholder={addSearchPlaceholder}
          onSelect={handleSelect}
        />
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 glass-card font-label-caps text-label-caps text-on-surface-variant rounded-full hover:bg-white/10 transition-all"
        >
          {addCancelButton}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="border-2 border-dashed border-white/10 p-6 rounded-xl flex flex-col items-center justify-center h-64 bg-white/2 hover:border-white/30 group transition-all w-full"
    >
      <div className="w-16 h-16 rounded-full bg-surface-container-highest/50 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <span className="material-symbols-outlined text-primary text-3xl">add</span>
      </div>
      <h2 className="font-headline-md text-headline-md text-on-surface-variant group-hover:text-primary transition-colors">
        {addLocation}
      </h2>
      <p className="font-label-caps text-label-caps text-outline mt-2">{addLocationSub}</p>
    </button>
  );
}
