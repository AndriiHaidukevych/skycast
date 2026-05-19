import { describe, it, expect } from "vitest";
import { getSolarData } from "../index";

// London, 2024-06-21 (summer solstice) — known sunrise ~04:43 BST, sunset ~21:21 BST
// BST = UTC+1 → timezoneOffsetSeconds = 3600
const LONDON_LAT = 51.5074;
const LONDON_LON = -0.1278;
const SUMMER_SOLSTICE = new Date("2024-06-21T00:00:00Z");
const BST_OFFSET = 3600;

describe("getSolarData", () => {
  it("returns sunrise before sunset", () => {
    const result = getSolarData(LONDON_LAT, LONDON_LON, SUMMER_SOLSTICE, BST_OFFSET);
    const [sunriseH, sunriseMin] = result.sunrise.replace(/[AP]M/, "").trim().split(":").map(Number);
    const [sunsetH, sunsetMin] = result.sunset.replace(/[AP]M/, "").trim().split(":").map(Number);

    // On summer solstice sunrise is AM, sunset is PM
    expect(result.sunrise).toMatch(/AM/);
    expect(result.sunset).toMatch(/PM/);
    expect(sunriseH).toBeLessThanOrEqual(6);
    expect(sunsetH).toBeGreaterThanOrEqual(8);

    void sunriseMin;
    void sunsetMin;
  });

  it("formats time as HH:MM AM/PM", () => {
    const result = getSolarData(LONDON_LAT, LONDON_LON, SUMMER_SOLSTICE, BST_OFFSET);
    expect(result.sunrise).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
    expect(result.sunset).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
  });

  it("returns daylight duration in Xh Ym format", () => {
    const result = getSolarData(LONDON_LAT, LONDON_LON, SUMMER_SOLSTICE, BST_OFFSET);
    expect(result.daylightDuration).toMatch(/^\d+h \d+m$/);
  });

  it("summer solstice in London has more than 16 hours of daylight", () => {
    const result = getSolarData(LONDON_LAT, LONDON_LON, SUMMER_SOLSTICE, BST_OFFSET);
    const [h] = result.daylightDuration.split("h").map(Number);
    expect(h).toBeGreaterThanOrEqual(16);
  });
});
