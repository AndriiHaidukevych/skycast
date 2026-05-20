export const LAYERS = [
  { id: "precipitation_new", label: "Rain" },
  { id: "temp_new", label: "Temp" },
  { id: "wind_new", label: "Wind" },
  { id: "clouds_new", label: "Clouds" },
] as const;

export type LayerId = (typeof LAYERS)[number]["id"];
