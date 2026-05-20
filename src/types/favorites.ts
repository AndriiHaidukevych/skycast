export interface FavoriteCity {
  id: string;
  city_name: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
  createdAt: string;
  weather?: {
    temp: number;
    description: string;
    conditionCode: number;
  };
}
