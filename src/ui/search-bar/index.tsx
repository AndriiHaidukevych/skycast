"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCitySearch } from "@/src/hooks/use-city-search";
import type { GeocodingResult } from "@/src/types/geocoding";

interface Props {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onSelect?: (city: GeocodingResult) => void;
}

function formatLocation({ name, state, country }: GeocodingResult): string {
  return [name, state, country].filter(Boolean).join(", ");
}

export function SearchBar({
  placeholder = "Search cities...",
  className,
  inputClassName,
  onSelect,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { results, isPending, clear } = useCitySearch(query);

  // Computed — no setState in effects for this
  const isOpen = isFocused && query.trim().length >= 2 && (results.length > 0 || isPending);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (city: GeocodingResult) => {
      setQuery("");
      setSelectedIndex(-1);
      setIsFocused(false);
      clear();
      if (onSelect) {
        onSelect(city);
      } else {
        router.push(`/details/${encodeURIComponent(city.name)}`);
      }
    },
    [onSelect, router, clear]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setSelectedIndex(-1); // reset selection on every keystroke
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        } else if (results[0]) {
          handleSelect(results[0]);
        } else if (query.trim()) {
          setIsFocused(false);
          router.push(`/details/${encodeURIComponent(query.trim())}`);
        }
        break;
      case "Escape":
        setIsFocused(false);
        setSelectedIndex(-1);
        break;
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
          search
        </span>
        {isPending && (
          <div className="absolute right-3 top-0 bottom-0 flex items-center">
            <div className="w-4 h-4 rounded-full border-2 border-outline/30 border-t-primary animate-spin" />
          </div>
        )}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          aria-label="Search cities"
          className={
            inputClassName ??
            "w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-all"
          }
        />
      </div>

      {isOpen && (
        <ul role="listbox" className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-50">
          {isPending && results.length === 0 && (
            <li className="px-4 py-3 font-body-md text-on-surface-variant">Searching…</li>
          )}
          {results.map((city, i) => (
            <li key={`${city.lat}-${city.lon}`} role="option" aria-selected={i === selectedIndex}>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(city)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  i === selectedIndex ? "bg-white/10" : "hover:bg-white/5"
                } ${i > 0 ? "border-t border-white/5" : ""}`}
              >
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                  location_on
                </span>
                <span className="font-body-md text-on-surface">{formatLocation(city)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
