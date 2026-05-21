import { RecommendationEngine } from "./recommendation.engine";
import { OutfitStrategy } from "./strategies/outfit.strategy";
import { ActivityStrategy } from "./strategies/activity.strategy";
import { HealthStrategy } from "./strategies/health.strategy";
import type { Recommendations } from "@/src/types/weather";
import type { RecommendationInput } from "./recommendations.types";

// Open for extension: register a new strategy without touching existing code
const engine = new RecommendationEngine()
  .register("outfit", new OutfitStrategy())
  .register("activity", new ActivityStrategy())
  .register("health", new HealthStrategy());

export function getRecommendations({
  temp,
  conditionCode,
  windSpeed,
  uvIndex,
  humidity,
}: RecommendationInput): Recommendations {
  const input = { temp, conditionCode, windSpeed, uvIndex, humidity };
  return {
    outfit: engine.run("outfit", input),
    activity: engine.run("activity", input),
    health: engine.run("health", input),
  };
}

export type { RecommendationInput };
