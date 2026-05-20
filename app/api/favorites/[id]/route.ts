import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import { removeFavorite } from "@/src/modules/favorites";
import { API_ERRORS } from "@/src/lib/messages";

const { UNAUTHORIZED, NOT_FOUND } = API_ERRORS;

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: UNAUTHORIZED }, { status: 401 });

  const { id } = await params;
  const deleted = await removeFavorite(session.user.id, id);

  if (!deleted) {
    return NextResponse.json({ error: NOT_FOUND }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
