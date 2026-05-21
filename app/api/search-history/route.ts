import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import { saveSearch, getRecentSearches } from "@/src/modules/search-history";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ searches: [] });

  const searches = await getRecentSearches(session.user.id);
  return NextResponse.json({ searches });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ ok: false });

  const { searchTerm } = await request.json();
  if (!searchTerm?.trim()) return NextResponse.json({ ok: false });

  await saveSearch(searchTerm.trim(), session.user.id);
  return NextResponse.json({ ok: true });
}
