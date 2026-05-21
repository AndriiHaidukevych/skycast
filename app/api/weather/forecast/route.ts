import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCachedForecast, getCacheHeaders, WeatherApiError } from "@/src/lib/weather-cache";
import { API_ERRORS } from "@/src/lib/messages";

const { CITY_REQUIRED, INTERNAL_ERROR } = API_ERRORS;

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: CITY_REQUIRED }, { status: 400 });
  }

  try {
    const { _fetchedAt, ...data } = await getCachedForecast(city);
    return NextResponse.json(data, { headers: getCacheHeaders(_fetchedAt) });
  } catch (err) {
    if (err instanceof WeatherApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
    }
    return NextResponse.json({ error: INTERNAL_ERROR }, { status: 500 });
  }
}
