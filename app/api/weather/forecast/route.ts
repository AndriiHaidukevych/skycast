import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchForecast, WeatherApiError } from "@/src/modules/weather";
import { groupForecastByDay } from "@/src/modules/weather/weather.utils";
import { API_ERRORS } from "@/src/lib/messages";
import type { ForecastResponse } from "@/src/types/weather";

const { CITY_REQUIRED, INTERNAL_ERROR } = API_ERRORS;

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: CITY_REQUIRED }, { status: 400 });
  }

  try {
    const raw = await fetchForecast(city);
    const {
      city: { timezone },
    } = raw;
    const forecast = groupForecastByDay(raw, timezone);
    const response: ForecastResponse = { forecast };
    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof WeatherApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
    }
    return NextResponse.json({ error: INTERNAL_ERROR }, { status: 500 });
  }
}
