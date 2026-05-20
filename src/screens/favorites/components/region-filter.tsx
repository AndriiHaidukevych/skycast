"use client";

import { REGION_FILTERS } from "../favorites.constants";
import type { RegionId } from "../favorites.constants";

interface Props {
  active: RegionId;
  onChange: (region: RegionId) => void;
}

export function RegionFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-stack-sm overflow-x-auto pb-1">
      {REGION_FILTERS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-4 py-1.5 rounded-full font-label-caps text-label-caps whitespace-nowrap transition-colors ${
            active === id
              ? "bg-primary-container text-on-primary-container"
              : "bg-white/5 hover:bg-white/10 text-on-surface-variant"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
