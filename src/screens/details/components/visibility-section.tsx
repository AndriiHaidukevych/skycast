import type { WeatherData } from "@/src/types/weather";
import { DETAILS_MESSAGES, WEATHER_STAT_LABELS, VISIBILITY_NOTES } from "../details.constants";

interface Props {
  weather: WeatherData;
}

const { visibilityTitle } = DETAILS_MESSAGES;
const { visibility, chanceOfRain, dewPoint, cloudCover } = WEATHER_STAT_LABELS;
const {
  visibilityClear,
  visibilityReduced,
  rainLikely,
  showersIsolated,
  dewPointDry,
  dewPointComfort,
  cloudsClear,
  cloudsPartly,
  cloudsMostly,
} = VISIBILITY_NOTES;

export function VisibilitySection({ weather }: Props) {
  const {
    visibility: visibilityKm,
    precipitationChance,
    dewPoint: dewPointVal,
    cloudCover: cloudCoverVal,
  } = weather;

  const stats = [
    {
      label: visibility,
      value: `${visibilityKm} km`,
      note: visibilityKm >= 10 ? visibilityClear : visibilityReduced,
    },
    {
      label: chanceOfRain,
      value: `${precipitationChance}%`,
      note: precipitationChance > 50 ? rainLikely : showersIsolated,
    },
    {
      label: dewPoint,
      value: `${dewPointVal}°`,
      note: dewPointVal < 10 ? dewPointDry : dewPointComfort,
    },
    {
      label: cloudCover,
      value: `${cloudCoverVal}%`,
      note: cloudCoverVal < 25 ? cloudsClear : cloudCoverVal < 75 ? cloudsPartly : cloudsMostly,
    },
  ];

  return (
    <section className="glass-card rounded-xl p-stack-md">
      <div className="flex items-center gap-gutter mb-stack-md">
        <h2 className="font-headline-md text-headline-md">{visibilityTitle}</h2>
        <div className="h-px flex-grow bg-white/10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-md">
        {stats.map(({ label, value, note }) => (
          <div key={label} className="space-y-base">
            <p className="font-label-caps text-label-caps text-on-surface-variant">{label}</p>
            <p className="font-headline-lg text-headline-lg">{value}</p>
            <p className="font-body-md text-on-surface-variant">{note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
