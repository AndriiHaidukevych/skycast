import type { WeatherData } from "@/src/types/weather";
import type { OpenWeatherCurrent } from "./validation";
import type { SolarResult } from "@/src/modules/solar/solar.types";

export function mapToWeatherData(raw: OpenWeatherCurrent, solar: SolarResult): WeatherData {
  const { name, sys, coord, main, wind, clouds, visibility, timezone } = raw;
  const { sunrise, sunset, daylightDuration, twilightDuration } = solar;
  const [{ id: conditionCode, description }] = raw.weather;

  return {
    city: name,
    country: sys.country,
    lat: coord.lat,
    lon: coord.lon,
    timezone: String(timezone),
    temp: Math.round(main.temp),
    feelsLike: Math.round(main.feels_like),
    tempMin: Math.round(main.temp_min),
    tempMax: Math.round(main.temp_max),
    description,
    conditionCode,
    humidity: main.humidity,
    pressure: main.pressure,
    windSpeed: wind.speed,
    visibility: Math.round(visibility / 1000),
    cloudCover: clouds.all,
    dewPoint: 0,
    uvIndex: 0,
    precipitationChance: 0,
    sunrise,
    sunset,
    daylightDuration,
    twilightDuration,
  };
}
