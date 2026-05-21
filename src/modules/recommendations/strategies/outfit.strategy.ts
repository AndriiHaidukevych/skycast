import { RECOMMENDATION_MESSAGES } from "@/src/lib/messages";
import { isRainy } from "../weather.predicates";
import type { IRecommendationStrategy } from "../recommendation.strategy";
import type { RecommendationInput } from "../recommendations.types";

const {
  HEAVY_COAT,
  WARM_COAT,
  LAYER_UP,
  LIGHT_LAYERS,
  LIGHT_CLOTHING,
  SUFFIX_UMBRELLA,
  SUFFIX_WIND,
} = RECOMMENDATION_MESSAGES.outfit;

export class OutfitStrategy implements IRecommendationStrategy {
  recommend({ temp, conditionCode, windSpeed }: RecommendationInput) {
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
}
