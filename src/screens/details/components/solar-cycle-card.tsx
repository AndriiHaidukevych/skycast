import type { WeatherData } from "@/src/types/weather";
import { DETAILS_MESSAGES } from "../details.constants";

interface Props {
  weather: WeatherData;
}

const { solarTitle, sunrise, sunset, daylight, twilight } = DETAILS_MESSAGES;

export function SolarCycleCard({ weather }: Props) {
  const { sunrise: sunriseTime, sunset: sunsetTime, daylightDuration, twilightDuration } = weather;

  return (
    <div className="md:col-span-4 glass-card rounded-xl p-stack-md flex flex-col justify-between">
      <div>
        <h2 className="font-headline-md text-headline-md mb-stack-sm">{solarTitle}</h2>
        <div className="space-y-stack-md mt-stack-md">
          <div className="flex items-center gap-gutter">
            <div className="w-12 h-12 rounded-full glass-card-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">light_mode</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">{sunrise}</p>
              <p className="font-headline-md text-headline-md">{sunriseTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-gutter">
            <div className="w-12 h-12 rounded-full glass-card-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-container">dark_mode</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">{sunset}</p>
              <p className="font-headline-md text-headline-md">{sunsetTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-stack-lg pt-stack-md border-t border-white/5">
        <div className="flex justify-between items-end">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant">{daylight}</p>
            <p className="font-body-lg text-body-lg">{daylightDuration}</p>
          </div>
          <div className="text-right">
            <p className="font-label-caps text-label-caps text-on-surface-variant">{twilight}</p>
            <p className="font-body-lg text-body-lg">{twilightDuration}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
