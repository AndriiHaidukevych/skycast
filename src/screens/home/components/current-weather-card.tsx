import type { WeatherData, Recommendations } from "@/src/types/weather";
import Link from "next/link";
import { HOME_MESSAGES, UV_LABELS } from "../home.constants";

interface Props {
  weather: WeatherData;
  recommendations: Recommendations;
}

export function CurrentWeatherCard({ weather, recommendations }: Props) {
  const { city, country, description, temp, feelsLike, tempMin, tempMax, uvIndex } = weather;
  const { outfit } = recommendations;
  const { currentLocation, uvIndexLabel, outfitLabel, viewFullDetails } = HOME_MESSAGES;
  const { veryHigh, high, moderate, low } = UV_LABELS;

  const uvLabel = uvIndex >= 8 ? veryHigh : uvIndex >= 6 ? high : uvIndex >= 3 ? moderate : low;

  return (
    <section className="glass-card-heavy rounded-xl p-stack-md md:p-stack-lg grid grid-cols-1 md:grid-cols-2 gap-stack-lg relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle at 20% 30%, #1e3a8a 0%, transparent 60%)" }}
      />

      {/* Left: location + temperature */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-stack-sm">
          <span className="material-symbols-outlined text-primary text-[18px]">near_me</span>
          <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
            {currentLocation}
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-1">
          {city}, {country}
        </h1>
        <p className="font-body-md text-on-surface-variant mb-stack-md capitalize">{description}</p>
        <div className="flex items-end gap-stack-md">
          <span className="font-display-temp leading-none text-white" style={{ fontSize: "120px" }}>
            {temp}°
          </span>
          <div className="pb-4">
            <p className="font-headline-md text-headline-md">
              H: {tempMax}° L: {tempMin}°
            </p>
            <p className="font-label-caps text-label-caps text-primary">FEELS LIKE {feelsLike}°</p>
          </div>
        </div>
      </div>

      {/* Right: badges + recommendation */}
      <div className="relative z-10 flex flex-col justify-end items-start md:items-end gap-stack-md">
        <div className="flex flex-wrap gap-stack-sm justify-start md:justify-end">
          <span className="glass-card px-4 py-2 rounded-full flex items-center gap-2 font-label-caps text-label-caps">
            <span className="material-symbols-outlined text-secondary text-[18px]">wb_sunny</span>
            {uvIndexLabel}: {uvLabel.toUpperCase()}
          </span>
        </div>
        <div className="w-full md:max-w-xs glass-card rounded-lg p-stack-sm border-l-4 border-primary">
          <p className="font-label-caps text-label-caps text-primary mb-1">{outfitLabel}</p>
          <p className="font-body-md italic text-on-surface-variant">
            &ldquo;{outfit.title} — {outfit.description.slice(0, 80)}
            {outfit.description.length > 80 ? "…" : ""}&rdquo;
          </p>
        </div>
        <Link
          href={`/details/${encodeURIComponent(city)}`}
          className="flex items-center gap-2 bg-primary/10 border border-primary/30 hover:bg-primary/20 active:scale-95 transition-all px-4 py-2 rounded-full font-label-caps text-label-caps text-primary whitespace-nowrap"
        >
          {viewFullDetails}
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
