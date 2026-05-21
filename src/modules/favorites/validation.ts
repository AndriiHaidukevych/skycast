import { z } from "zod";

export const AddFavoriteSchema = z.object({
  city_name: z.string().min(1),
  country: z.string().min(1),
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
});
