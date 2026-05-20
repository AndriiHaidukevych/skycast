import type { WeatherData } from "@/src/types/weather";
import { STATS_LABELS } from "../home.constants";

interface Props {
  weather: WeatherData;
}

interface StatItem {
  icon: string;
  label: string;
  value: string;
}

export function StatsGrid({ weather }: Props) {
  const { humidity, pressure, visibility, sunset } = weather;
  const {
    humidity: humidityLabel,
    pressure: pressureLabel,
    visibility: visibilityLabel,
    sunset: sunsetLabel,
  } = STATS_LABELS;

  const stats: StatItem[] = [
    { icon: "humidity_percentage", label: humidityLabel, value: `${humidity}%` },
    { icon: "compress", label: pressureLabel, value: `${pressure} hPa` },
    { icon: "visibility", label: visibilityLabel, value: `${visibility} km` },
    { icon: "wb_twilight", label: sunsetLabel, value: sunset },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
      {stats.map(({ icon, label, value }) => (
        <div
          key={label}
          className="glass-card rounded-xl p-stack-sm flex flex-col items-center justify-center text-center gap-2"
        >
          <span className="material-symbols-outlined text-primary-container">{icon}</span>
          <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
          <span className="font-headline-md text-headline-md">{value}</span>
        </div>
      ))}
    </section>
  );
}
