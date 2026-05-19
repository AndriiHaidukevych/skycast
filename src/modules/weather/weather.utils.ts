import type { ForecastDay } from "@/src/types/weather";
import type { OpenWeatherForecast } from "./validation";

const SLOT_HOURS = { morning: 9, afternoon: 14, evening: 20 };

function closestSlot(items: OpenWeatherForecast["list"], targetHour: number) {
  return items.reduce((best, item) => {
    const h = new Date(item.dt * 1000).getUTCHours();
    const bestH = new Date(best.dt * 1000).getUTCHours();
    return Math.abs(h - targetHour) < Math.abs(bestH - targetHour) ? item : best;
  });
}

export function groupForecastByDay(
  data: OpenWeatherForecast,
  timezoneOffsetSeconds: number
): ForecastDay[] {
  const byDay = new Map<string, OpenWeatherForecast["list"]>();

  for (const item of data.list) {
    const localMs = item.dt * 1000 + timezoneOffsetSeconds * 1000;
    const localDate = new Date(localMs);
    const key = localDate.toISOString().slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(item);
  }

  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  return Array.from(byDay.entries())
    .filter(([key]) => key !== todayKey)
    .slice(0, 3)
    .map(([dateKey, items]) => {
      const date = new Date(dateKey);
      const label = date.toLocaleDateString("en-US", { weekday: "long" });
      const shortDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const morningSlot = closestSlot(items, SLOT_HOURS.morning);
      const afternoonSlot = closestSlot(items, SLOT_HOURS.afternoon);
      const eveningSlot = closestSlot(items, SLOT_HOURS.evening);

      const { icon } = afternoonSlot.weather[0];
      const { temp: morningTemp } = morningSlot.main;
      const { temp: afternoonTemp } = afternoonSlot.main;
      const { temp: eveningTemp } = eveningSlot.main;

      return {
        date: shortDate,
        label,
        icon,
        morning: Math.round(morningTemp),
        afternoon: Math.round(afternoonTemp),
        evening: Math.round(eveningTemp),
      };
    });
}
