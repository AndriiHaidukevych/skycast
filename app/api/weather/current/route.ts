import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchCurrentWeather, mapToWeatherData, WeatherApiError } from "@/src/modules/weather";
import { getSolarData } from "@/src/modules/solar";
import { getRecommendations } from "@/src/modules/recommendations";
import { API_ERRORS } from "@/src/lib/messages";
import type { CurrentWeatherResponse } from "@/src/types/weather";

const { CITY_REQUIRED, INTERNAL_ERROR } = API_ERRORS;

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: CITY_REQUIRED }, { status: 400 });
  }

  try {
    const raw = await fetchCurrentWeather(city);
    const {
      coord: { lat, lon },
      timezone,
    } = raw;
    const solar = getSolarData(lat, lon, new Date(), timezone);
    const weather = mapToWeatherData(raw, solar);
    const { temp, conditionCode, windSpeed, uvIndex, humidity } = weather;
    const recommendations = getRecommendations({
      temp,
      conditionCode,
      windSpeed,
      uvIndex,
      humidity,
    });
    const response: CurrentWeatherResponse = { weather, recommendations };
    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof WeatherApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
    }
    return NextResponse.json({ error: INTERNAL_ERROR }, { status: 500 });
  }
}
