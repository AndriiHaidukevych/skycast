import type { Recommendation } from "@/src/types/weather";
import type { IRecommendationStrategy } from "./recommendation.strategy";
import type { RecommendationInput } from "./recommendations.types";

export class RecommendationEngine {
  private readonly strategies = new Map<string, IRecommendationStrategy>();

  register(key: string, strategy: IRecommendationStrategy): this {
    this.strategies.set(key, strategy);
    return this;
  }

  run(key: string, input: RecommendationInput): Recommendation {
    const strategy = this.strategies.get(key);
    if (!strategy) throw new Error(`No strategy registered for: "${key}"`);
    return strategy.recommend(input);
  }
}
