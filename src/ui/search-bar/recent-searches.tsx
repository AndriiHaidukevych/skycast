import { SEARCH_BAR_MESSAGES } from "./search-bar.constants";

interface Props {
  items: string[];
  onSelect: (term: string) => void;
}

const { recentSearches } = SEARCH_BAR_MESSAGES;

export function RecentSearches({ items, onSelect }: Props) {
  return (
    <div>
      <p className="px-4 pt-3 pb-1 font-label-caps text-label-caps text-on-surface-variant/60">
        {recentSearches}
      </p>
      <ul role="listbox">
        {items.map((term, i) => (
          <li key={term}>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(term)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors ${
                i > 0 ? "border-t border-white/5" : ""
              }`}
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0">
                history
              </span>
              <span className="font-body-md text-on-surface">{term}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
