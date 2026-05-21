"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCitySearch } from "@/src/hooks/use-city-search";
import { useSearchHistory } from "@/src/hooks/use-search-history";
import { SearchResultsDropdown } from "./search-results-dropdown";
import { RecentSearches } from "./recent-searches";
import { SEARCH_BAR_MESSAGES } from "./search-bar.constants";
import type { GeocodingResult } from "@/src/types/geocoding";

interface Props {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onSelect?: (city: GeocodingResult) => void;
}

export function SearchBar({
  placeholder = SEARCH_BAR_MESSAGES.defaultPlaceholder,
  className,
  inputClassName,
  onSelect,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { results, isPending, isEmpty, clear } = useCitySearch(query);
  const { history, saveSearch } = useSearchHistory();

  const showHistory = isFocused && query.trim().length < 2 && history.length > 0;
  const showResults =
    isFocused && query.trim().length >= 2 && (results.length > 0 || isPending || isEmpty);
  const isOpen = showHistory || showResults;

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
      saveSearch(city.name);
      if (onSelect) {
        onSelect(city);
      } else {
        router.push(`/details/${encodeURIComponent(city.name)}`);
      }
    },
    [onSelect, router, clear, saveSearch]
  );

  function handleHistorySelect(term: string) {
    setIsFocused(false);
    router.push(`/details/${encodeURIComponent(term)}`);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;

    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case "ArrowDown":
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl">
          {showHistory && <RecentSearches items={history} onSelect={handleHistorySelect} />}
          {showResults && (
            <SearchResultsDropdown
              results={results}
              isPending={isPending}
              isEmpty={isEmpty}
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
            />
          )}
        </div>
      )}
    </div>
  );
}
