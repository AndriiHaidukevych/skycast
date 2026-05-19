import SunCalc from "suncalc";
import type { SolarResult } from "./solar.types";

function formatTime(date: Date, timezoneOffsetSeconds: number): string {
  const utcMs = date.getTime();
  const localMs = utcMs + timezoneOffsetSeconds * 1000;
  const local = new Date(localMs);
  const h = local.getUTCHours();
  const m = local.getUTCMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function formatDuration(ms: number): string {
  const totalMinutes = Math.round(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

export function getSolarData(
  lat: number,
  lon: number,
  date: Date,
  timezoneOffsetSeconds: number
): SolarResult {
  const { sunrise: sunriseDate, sunset: sunsetDate, dusk } = SunCalc.getTimes(date, lat, lon);

  const sunrise = formatTime(sunriseDate, timezoneOffsetSeconds);
  const sunset = formatTime(sunsetDate, timezoneOffsetSeconds);
  const daylightDuration = formatDuration(sunsetDate.getTime() - sunriseDate.getTime());
  const twilightDuration = formatDuration(dusk.getTime() - sunsetDate.getTime());

  return { sunrise, sunset, daylightDuration, twilightDuration };
}

export type { SolarResult };
