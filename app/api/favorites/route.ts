import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import { getFavorites, addFavorite } from "@/src/modules/favorites";
import { AddFavoriteSchema } from "@/src/modules/favorites/validation";
import { API_ERRORS } from "@/src/lib/messages";

const { UNAUTHORIZED, INVALID_BODY } = API_ERRORS;

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: UNAUTHORIZED }, { status: 401 });

  const favorites = await getFavorites(session.user.id);
  return NextResponse.json({ favorites });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: UNAUTHORIZED }, { status: 401 });

  const body = await request.json();
  const parsed = AddFavoriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: INVALID_BODY }, { status: 400 });
  }

  const favorite = await addFavorite(session.user.id, parsed.data);
  return NextResponse.json({ favorite }, { status: 201 });
}
