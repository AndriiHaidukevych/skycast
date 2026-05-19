import { describe, it, expect } from "vitest";
import { getRecommendations } from "../index";

const base = { windSpeed: 5, uvIndex: 3, humidity: 60 };

describe("getRecommendations — outfit", () => {
  it("heavy coat below 5°C", () => {
    const { outfit } = getRecommendations({ ...base, temp: -2, conditionCode: 800 });
    expect(outfit.title).toBe("Heavy Winter Coat");
  });

  it("light clothing above 22°C", () => {
    const { outfit } = getRecommendations({ ...base, temp: 25, conditionCode: 800 });
    expect(outfit.title).toBe("Light Clothing");
  });

  it("adds umbrella note when rainy", () => {
    const { outfit } = getRecommendations({ ...base, temp: 15, conditionCode: 500 });
    expect(outfit.description).toContain("umbrella");
  });
});

describe("getRecommendations — activity", () => {
  it("indoor on storm", () => {
    const { activity } = getRecommendations({ ...base, temp: 18, conditionCode: 211 });
    expect(activity.title).toBe("Stay Indoors");
  });

  it("outdoor jogging on clear good temp", () => {
    const { activity } = getRecommendations({ ...base, temp: 18, conditionCode: 800 });
    expect(activity.title).toBe("Outdoor Jogging");
  });

  it("indoor activities on rain", () => {
    const { activity } = getRecommendations({ ...base, temp: 15, conditionCode: 501 });
    expect(activity.title).toBe("Indoor Activities");
  });
});

describe("getRecommendations — health", () => {
  it("high UV alert at uvIndex 8", () => {
    const { health } = getRecommendations({ ...base, temp: 25, conditionCode: 800, uvIndex: 8 });
    expect(health.title).toBe("High UV Alert");
  });

  it("sunscreen at uvIndex 6", () => {
    const { health } = getRecommendations({ ...base, temp: 25, conditionCode: 800, uvIndex: 6 });
    expect(health.title).toBe("Apply Sunscreen");
  });

  it("hydration alert at high humidity", () => {
    const { health } = getRecommendations({ ...base, temp: 25, conditionCode: 800, humidity: 85 });
    expect(health.title).toBe("Stay Hydrated");
  });
});
