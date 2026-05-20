import type { WeatherData } from "@/src/types/weather";
import { WEATHER_STAT_LABELS, getUvLabel } from "../details.constants";

interface Props {
  weather: WeatherData;
  isFav: boolean;
  onToggleFavorite: () => void;
}

const { windSpeed, humidity, uvIndex, pressure } = WEATHER_STAT_LABELS;

export function WeatherDetailCard({ weather, isFav, onToggleFavorite }: Props) {
  const {
    city,
    country,
    description,
    conditionCode,
    temp,
    feelsLike,
    windSpeed: windSpeedMs,
    humidity: humidityVal,
    uvIndex: uvIndexVal,
    pressure: pressureVal,
  } = weather;

  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const monthDay = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

  void conditionCode;

  const stats = [
    { label: windSpeed, icon: "air", value: `${Math.round(windSpeedMs * 3.6)} km/h` },
    { label: humidity, icon: "humidity_percentage", value: `${humidityVal}%` },
    { label: uvIndex, icon: "wb_sunny", value: getUvLabel(uvIndexVal) },
    { label: pressure, icon: "compress", value: `${pressureVal} hPa` },
  ];

  return (
    <div className="md:col-span-8 glass-card rounded-xl p-stack-md flex flex-col justify-between min-h-[400px] relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />

      <div className="flex justify-between items-start z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              {city}, {country}
            </h1>
            <button
              onClick={onToggleFavorite}
              title={isFav ? "Remove from favorites" : "Add to favorites"}
              className="hover:scale-110 transition-transform shrink-0"
            >
              <span
                className={`material-symbols-outlined text-[32px] ${isFav ? "text-secondary" : "text-on-surface-variant/50 hover:text-secondary"} transition-colors`}
                style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </span>
            </button>
          </div>
          <p className="font-body-md text-on-surface-variant capitalize">
            {description} • {dayName}, {monthDay}
          </p>
        </div>
        <div className="text-right">
          <span className="font-display-temp text-display-temp text-primary block leading-none">
            {temp}°
          </span>
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            FEELS LIKE {feelsLike}°
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter z-10">
        {stats.map(({ label, icon, value }) => (
          <div key={label} className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant opacity-70">
              {label}
            </span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">{icon}</span>
              <span className="font-headline-md text-headline-md">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
