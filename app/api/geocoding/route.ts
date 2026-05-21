import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchGeocoding } from "@/src/modules/geocoding";
import { API_ERRORS } from "@/src/lib/messages";

const { CITY_REQUIRED, INTERNAL_ERROR } = API_ERRORS;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ error: CITY_REQUIRED }, { status: 400 });
  }

  try {
    const results = await fetchGeocoding(q.trim());
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: INTERNAL_ERROR }, { status: 500 });
  }
}
