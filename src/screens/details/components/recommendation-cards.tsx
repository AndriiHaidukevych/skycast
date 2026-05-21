import type { Recommendations } from "@/src/types/weather";
import { DETAILS_MESSAGES } from "../details.constants";

interface Props {
  recommendations: Recommendations;
}

const { recommendationsTitle, latestAnalysis, outfitLabel, activityLabel, healthLabel } =
  DETAILS_MESSAGES;

export function RecommendationCards({ recommendations }: Props) {
  const { outfit, activity, health } = recommendations;

  const cards = [
    { data: outfit, label: outfitLabel, colorClass: "text-secondary" },
    { data: activity, label: activityLabel, colorClass: "text-primary" },
    { data: health, label: healthLabel, colorClass: "text-error" },
  ];

  return (
    <section className="space-y-stack-sm">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="font-headline-lg text-headline-lg">{recommendationsTitle}</h2>
        <span className="bg-secondary-container/20 text-secondary font-label-caps text-label-caps px-4 py-1 rounded-full border border-secondary/30">
          {latestAnalysis}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {cards.map(({ data: { icon, title, description }, label, colorClass }) => (
          <div
            key={label}
            className="glass-card rounded-xl p-stack-md"
          >
            <div className="flex items-start justify-between mb-stack-sm">
              <span className={`material-symbols-outlined ${colorClass} text-4xl`}>{icon}</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                {label}
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-2">{title}</h3>
            <p className="font-body-md text-on-surface-variant">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
