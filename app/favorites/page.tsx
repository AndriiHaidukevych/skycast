import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";

export default async function FavoritesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return <div>Favorites — coming soon</div>;
}
