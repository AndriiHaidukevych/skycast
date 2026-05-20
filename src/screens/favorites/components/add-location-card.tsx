"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FAVORITES_MESSAGES } from "../favorites.constants";

const { addLocation, addLocationSub, addSearchPlaceholder, addSearchButton, addCancelButton } =
  FAVORITES_MESSAGES;

export function AddLocationCard() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/details/${encodeURIComponent(query.trim())}`);
  }

  if (isOpen) {
    return (
      <div className="border-2 border-dashed border-primary/40 p-6 rounded-xl flex flex-col items-center justify-center h-64 bg-white/2">
        <form onSubmit={handleSearch} className="w-full space-y-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={addSearchPlaceholder}
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-4 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-all"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-primary text-on-primary font-label-caps text-label-caps py-2 rounded-full hover:bg-primary/90 transition-all"
            >
              {addSearchButton}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 glass-card font-label-caps text-label-caps text-on-surface-variant rounded-full hover:bg-white/10 transition-all"
            >
              {addCancelButton}
            </button>
          </div>
        </form>
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
