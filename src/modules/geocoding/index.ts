import axios from "axios";
import { OPENWEATHER_BASE_URL } from "@/src/lib/constants";
import { GeocodingResponseSchema } from "./validation";
import type { GeocodingResult } from "@/src/types/geocoding";

export async function fetchGeocoding(query: string): Promise<GeocodingResult[]> {
  const url = new URL(`${OPENWEATHER_BASE_URL}/geo/1.0/direct`);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "5");
  url.searchParams.set("appid", process.env.OPENWEATHER_API_KEY!);

  const { data } = await axios.get(url.toString());
  const parsed = GeocodingResponseSchema.parse(data);

  return parsed.map(({ name, country, state, lat, lon }) => ({
    name,
    country,
    state,
    lat,
    lon,
  }));
}

export type { GeocodingResult };
