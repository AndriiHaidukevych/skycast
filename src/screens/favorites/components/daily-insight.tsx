import type { FavoriteCity } from "@/src/types/favorites";
import { FAVORITES_MESSAGES } from "../favorites.constants";

interface Props {
  favorites: FavoriteCity[];
}

const {
  dailyInsightBadge,
  dailyInsightTitle,
  insightNoCities,
  insightIsExperiencing,
  insightLessIdeal,
} = FAVORITES_MESSAGES;

function getBestCity(favorites: FavoriteCity[]): FavoriteCity | null {
  const withWeather = favorites.filter((f) => f.weather);
  if (withWeather.length === 0) return null;
  return withWeather.reduce((best, curr) => {
    const { conditionCode: bc, temp: bt } = best.weather!;
    const { conditionCode: cc, temp: ct } = curr.weather!;
    const bestScore = (bc === 800 ? 2 : bc > 800 ? 1 : 0) + (bt >= 15 && bt <= 25 ? 1 : 0);
    const currScore = (cc === 800 ? 2 : cc > 800 ? 1 : 0) + (ct >= 15 && ct <= 25 ? 1 : 0);
    return currScore > bestScore ? curr : best;
  });
}

export function DailyInsight({ favorites }: Props) {
  const best = getBestCity(favorites);

  const withWeather = favorites.filter((f) => f.weather);
  const worst = withWeather.find(
    (f) => f.weather && f.weather.conditionCode >= 200 && f.weather.conditionCode < 700
  );

  return (
    <section className="mt-stack-lg p-stack-md glass-card rounded-2xl overflow-hidden">
      <div>
        <span className="bg-secondary/20 text-secondary border border-secondary/30 px-3 py-1 rounded-full font-label-caps text-label-caps mb-4 inline-block">
          {dailyInsightBadge}
        </span>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-4 text-white">
          {dailyInsightTitle}
        </h2>
        <p className="font-body-md text-on-surface leading-relaxed">
          {best ? (
            <>
              Currently, <strong>{best.city_name}</strong> offers the best conditions
              {best.weather && ` with ${best.weather.description} and ${best.weather.temp}°C`}.
              {worst && (
                <>
                  {" "}
                  <strong>{worst.city_name}</strong> {insightIsExperiencing}{" "}
                  {worst.weather?.description}
                  {insightLessIdeal}
                </>
              )}
            </>
          ) : (
            insightNoCities
          )}
        </p>
      </div>
    </section>
  );
}
