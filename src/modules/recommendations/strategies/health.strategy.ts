import { RECOMMENDATION_MESSAGES } from "@/src/lib/messages";
import type { IRecommendationStrategy } from "../recommendation.strategy";
import type { RecommendationInput } from "../recommendations.types";

const { HIGH_UV, APPLY_SUNSCREEN, STAY_HYDRATED, POLLEN_ALERT, AIR_QUALITY_GOOD } =
  RECOMMENDATION_MESSAGES.health;

export class HealthStrategy implements IRecommendationStrategy {
  recommend({ uvIndex, humidity, conditionCode }: RecommendationInput) {
    const month = new Date().getMonth() + 1;
    const pollenSeason = month >= 3 && month <= 6;
    const clearOrClouds = conditionCode >= 800;

    if (uvIndex >= 8) return HIGH_UV;
    if (uvIndex >= 6) return APPLY_SUNSCREEN;
    if (humidity > 80) return STAY_HYDRATED;
    if (pollenSeason && clearOrClouds) return POLLEN_ALERT;
    return AIR_QUALITY_GOOD;
  }
}
