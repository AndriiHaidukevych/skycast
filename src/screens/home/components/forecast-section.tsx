import type { ForecastDay } from "@/src/types/weather";
import { HOME_MESSAGES } from "../home.constants";

interface Props {
  forecast: ForecastDay[];
}

const OW_ICON_URL = (icon: string) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

export function ForecastSection({ forecast }: Props) {
  const { forecastTitle, forecastSlots } = HOME_MESSAGES;

  if (forecast.length === 0) return null;

  return (
    <section>
      <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-stack-md">
        {forecastTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {forecast.map(({ label, date, icon, morning, afternoon, evening }) => (
          <div
            key={date}
            className="glass-card rounded-xl p-stack-md hover:bg-white/10 transition-all cursor-default"
          >
            <div className="flex justify-between items-start mb-stack-md">
              <div>
                <p className="font-headline-md text-headline-md">{label}</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant">{date}</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={OW_ICON_URL(icon)} alt={label} width={48} height={48} />
            </div>
            <div className="space-y-stack-sm">
              {[
                { slot: forecastSlots[0], temp: morning },
                { slot: forecastSlots[1], temp: afternoon },
                { slot: forecastSlots[2], temp: evening },
              ].map(({ slot, temp }, i) => (
                <div key={slot}>
                  {i > 0 && <div className="h-px bg-white/10 w-full mb-stack-sm" />}
                  <div className="flex justify-between items-center font-body-md">
                    <span className="text-on-surface-variant">{slot}</span>
                    <span
                      className={`font-semibold ${slot === forecastSlots[1] ? "text-primary" : ""}`}
                    >
                      {temp}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
