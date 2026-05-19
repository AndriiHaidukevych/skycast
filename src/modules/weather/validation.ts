import { z } from "zod";

const WeatherConditionSchema = z.object({
  id: z.number(),
  description: z.string(),
  icon: z.string(),
});

export const OpenWeatherCurrentSchema = z.object({
  name: z.string(),
  sys: z.object({
    country: z.string(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
  coord: z.object({ lat: z.number(), lon: z.number() }),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    humidity: z.number(),
    pressure: z.number(),
  }),
  weather: z.array(WeatherConditionSchema).min(1),
  wind: z.object({ speed: z.number() }),
  clouds: z.object({ all: z.number() }),
  visibility: z.number(),
  timezone: z.number(),
});

export const OpenWeatherForecastItemSchema = z.object({
  dt: z.number(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
    pressure: z.number(),
  }),
  weather: z.array(WeatherConditionSchema).min(1),
  wind: z.object({ speed: z.number() }),
  clouds: z.object({ all: z.number() }),
  pop: z.number(),
  dt_txt: z.string(),
});

export const OpenWeatherForecastSchema = z.object({
  list: z.array(OpenWeatherForecastItemSchema),
  city: z.object({
    name: z.string(),
    country: z.string(),
    timezone: z.number(),
    coord: z.object({ lat: z.number(), lon: z.number() }),
  }),
});

export type OpenWeatherCurrent = z.infer<typeof OpenWeatherCurrentSchema>;
export type OpenWeatherForecast = z.infer<typeof OpenWeatherForecastSchema>;
