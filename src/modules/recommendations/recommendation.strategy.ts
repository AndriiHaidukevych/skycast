import type { Recommendation } from "@/src/types/weather";
import type { RecommendationInput } from "./recommendations.types";

export interface IRecommendationStrategy {
  recommend(input: RecommendationInput): Recommendation;
}
