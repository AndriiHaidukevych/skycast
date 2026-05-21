import { RECOMMENDATION_MESSAGES } from "@/src/lib/messages";
import { isRainy, isStormy } from "../weather.predicates";
import type { IRecommendationStrategy } from "../recommendation.strategy";
import type { RecommendationInput } from "../recommendations.types";

const {
  STAY_INDOORS,
  INDOOR_ACTIVITIES,
  LIGHT_INDOOR,
  MORNING_EVENING,
  OUTDOOR_JOGGING,
  CASUAL_WALK,
} = RECOMMENDATION_MESSAGES.activity;

export class ActivityStrategy implements IRecommendationStrategy {
  recommend({ temp, conditionCode, windSpeed }: RecommendationInput) {
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
}
