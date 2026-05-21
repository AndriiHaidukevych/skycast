import { describe, it, expect, vi, beforeEach } from "vitest";
import { groupForecastByDay } from "../weather.utils";
import type { OpenWeatherForecast } from "../validation";

// Mock suncalc to avoid import issues in test env
vi.mock("suncalc", () => ({
  default: {
    getTimes: () => ({
      sunrise: new Date("2024-06-21T04:00:00Z"),
      sunset: new Date("2024-06-21T20:00:00Z"),
      dusk: new Date("2024-06-21T20:34:00Z"),
    }),
  },
}));

function makeForecastItem(dtTxt: string, temp: number) {
  const dt = Math.floor(new Date(dtTxt).getTime() / 1000);
  return {
    dt,
    main: { temp, feels_like: temp - 2, humidity: 60, pressure: 1013 },
    weather: [{ id: 800, description: "clear sky", icon: "01d" }],
    wind: { speed: 3 },
    clouds: { all: 10 },
    pop: 0.1,
    dt_txt: dtTxt,
  };
}

const mockForecast: OpenWeatherForecast = {
  list: [
    makeForecastItem("2024-06-22 09:00:00", 18),
    makeForecastItem("2024-06-22 12:00:00", 22),
    makeForecastItem("2024-06-22 21:00:00", 16),
    makeForecastItem("2024-06-23 09:00:00", 17),
    makeForecastItem("2024-06-23 15:00:00", 21),
    makeForecastItem("2024-06-23 21:00:00", 15),
    makeForecastItem("2024-06-24 09:00:00", 14),
    makeForecastItem("2024-06-24 15:00:00", 19),
    makeForecastItem("2024-06-24 21:00:00", 13),
  ],
  city: { name: "London", country: "GB", timezone: 3600, coord: { lat: 51.5, lon: -0.12 } },
};

describe("groupForecastByDay", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 3 forecast days", () => {
    const result = groupForecastByDay(mockForecast, 0);
    expect(result).toHaveLength(3);
  });

  it("each day has morning, afternoon, evening temps", () => {
    const result = groupForecastByDay(mockForecast, 0);
    for (const day of result) {
      expect(typeof day.morning).toBe("number");
      expect(typeof day.afternoon).toBe("number");
      expect(typeof day.evening).toBe("number");
    }
  });

  it("each day has label and date", () => {
    const result = groupForecastByDay(mockForecast, 0);
    for (const day of result) {
      expect(day.label).toBeTruthy();
      expect(day.date).toBeTruthy();
    }
  });
});
