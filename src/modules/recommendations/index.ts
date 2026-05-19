import { RECOMMENDATION_MESSAGES } from "@/src/lib/messages";
import type { Recommendations } from "@/src/types/weather";
import type { RecommendationInput } from "./recommendations.types";

const { outfit: OUTFIT, activity: ACTIVITY, health: HEALTH } = RECOMMENDATION_MESSAGES;
const { HEAVY_COAT, WARM_COAT, LAYER_UP, LIGHT_LAYERS, LIGHT_CLOTHING, SUFFIX_UMBRELLA, SUFFIX_WIND } = OUTFIT;
const { STAY_INDOORS, INDOOR_ACTIVITIES, LIGHT_INDOOR, MORNING_EVENING, OUTDOOR_JOGGING, CASUAL_WALK } = ACTIVITY;
const { HIGH_UV, APPLY_SUNSCREEN, STAY_HYDRATED, POLLEN_ALERT, AIR_QUALITY_GOOD } = HEALTH;

function isRainy(code: number): boolean {
  return code >= 200 && code < 700;
}

function isStormy(code: number): boolean {
  return code >= 200 && code < 300;
}

function getOutfit(temp: number, conditionCode: number, windSpeed: number) {
  const rainy = isRainy(conditionCode);
  const windKmh = windSpeed * 3.6;

  let base: { title: string; description: string };
  if (temp < 5) base = HEAVY_COAT;
  else if (temp < 10) base = WARM_COAT;
  else if (temp < 15) base = LAYER_UP;
  else if (temp < 22) base = LIGHT_LAYERS;
  else base = LIGHT_CLOTHING;

  let description = base.description;
  if (rainy) description += SUFFIX_UMBRELLA;
  if (windKmh > 30) description += SUFFIX_WIND;

  return { title: base.title, description, icon: "checkroom" };
}

function getActivity(temp: number, conditionCode: number, windSpeed: number) {
  const stormy = isStormy(conditionCode);
  const rainy = isRainy(conditionCode);
  const windKmh = windSpeed * 3.6;
  const goodConditions = !rainy && temp >= 10 && temp <= 30 && windKmh < 35;

  if (stormy) return STAY_INDOORS;
  if (rainy) return INDOOR_ACTIVITIES;
  if (temp < 5) return LIGHT_INDOOR;
  if (temp > 32) return MORNING_EVENING;
  if (goodConditions) return OUTDOOR_JOGGING;
  return CASUAL_WALK;
}

function getHealth(uvIndex: number, humidity: number, conditionCode: number) {
  const month = new Date().getMonth() + 1;
  const pollenSeason = month >= 3 && month <= 6;
  const clearOrClouds = conditionCode >= 800;

  if (uvIndex >= 8) return HIGH_UV;
  if (uvIndex >= 6) return APPLY_SUNSCREEN;
  if (humidity > 80) return STAY_HYDRATED;
  if (pollenSeason && clearOrClouds) return POLLEN_ALERT;
  return AIR_QUALITY_GOOD;
}

export function getRecommendations({ temp, conditionCode, windSpeed, uvIndex, humidity }: RecommendationInput): Recommendations {
  return {
    outfit: getOutfit(temp, conditionCode, windSpeed),
    activity: getActivity(temp, conditionCode, windSpeed),
    health: getHealth(uvIndex, humidity, conditionCode),
  };
}

export type { RecommendationInput };
