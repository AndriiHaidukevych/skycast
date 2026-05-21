export interface WeatherBase {
  city: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  description: string;
  conditionCode: number;
}

export interface AtmosphericData {
  humidity: number;
  pressure: number;
  windSpeed: number;
  cloudCover: number;
  dewPoint: number;
  uvIndex: number;
  precipitationChance: number;
  visibility: number;
}

export interface SolarData {
  sunrise: string;
  sunset: string;
  daylightDuration: string;
  twilightDuration: string;
}

// Full type — backward compatible intersection
export type WeatherData = WeatherBase & AtmosphericData & SolarData;

export interface ForecastDay {
  date: string;
  label: string;
  icon: string;
  morning: number;
  afternoon: number;
  evening: number;
}

export interface Recommendation {
  title: string;
  description: string;
  icon: string;
}

export interface Recommendations {
  outfit: Recommendation;
  activity: Recommendation;
  health: Recommendation;
}

export interface CurrentWeatherResponse {
  weather: WeatherData;
  recommendations: Recommendations;
}

export interface ForecastResponse {
  forecast: ForecastDay[];
}
