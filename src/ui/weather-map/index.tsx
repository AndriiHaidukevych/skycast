"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { LAYERS } from "./weather-map.constants";
import type { LayerId } from "./weather-map.constants";

const WeatherMap = dynamic(() => import("./weather-map").then((m) => m.WeatherMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
    </div>
  ),
});

interface Props {
  lat: number;
  lon: number;
  city: string;
}

export function WeatherMapWidget({ lat, lon, city }: Props) {
  const [activeLayer, setActiveLayer] = useState<LayerId>("precipitation_new");

  return (
    <div className="relative w-full h-[320px] rounded-xl overflow-hidden glass-card">
      <WeatherMap lat={lat} lon={lon} activeLayer={activeLayer} />

      <div className="absolute top-stack-sm right-stack-sm z-[1000] flex items-center gap-2 glass-card px-3 py-1.5 rounded-full pointer-events-none">
        <span className="material-symbols-outlined text-primary text-[16px]">map</span>
        <span className="font-label-caps text-label-caps text-on-surface">
          LIVE WEATHER MAP · {city}
        </span>
      </div>

      <div className="absolute bottom-stack-sm left-1/2 -translate-x-1/2 z-[1000] flex gap-2 pointer-events-auto">
        {LAYERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveLayer(id)}
            className={`font-label-caps text-label-caps px-3 py-1 rounded-full transition-all ${
              activeLayer === id
                ? "bg-primary text-on-primary"
                : "glass-card text-on-surface-variant hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
