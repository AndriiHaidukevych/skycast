import type { GeocodingResult } from "@/src/types/geocoding";
import { SEARCH_BAR_MESSAGES } from "./search-bar.constants";

interface Props {
  results: GeocodingResult[];
  isPending: boolean;
  selectedIndex: number;
  onSelect: (city: GeocodingResult) => void;
}

function formatLocation({ name, state, country }: GeocodingResult): string {
  return [name, state, country].filter(Boolean).join(", ");
}

export function SearchResultsDropdown({ results, isPending, selectedIndex, onSelect }: Props) {
  return (
    <ul
      role="listbox"
      className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-50"
    >
      {isPending && results.length === 0 && (
        <li className="px-4 py-3 font-body-md text-on-surface-variant">
          {SEARCH_BAR_MESSAGES.searching}
        </li>
      )}
      {results.map((city, i) => (
        <li key={`${city.lat}-${city.lon}`} role="option" aria-selected={i === selectedIndex}>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(city)}
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
  );
}
