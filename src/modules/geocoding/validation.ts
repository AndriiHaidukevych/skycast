import { z } from "zod";

export const GeocodingItemSchema = z.object({
  name: z.string(),
  country: z.string(),
  state: z.string().optional(),
  lat: z.number(),
  lon: z.number(),
});

export const GeocodingResponseSchema = z.array(GeocodingItemSchema);

export type GeocodingItem = z.infer<typeof GeocodingItemSchema>;
