import { prisma } from "@/src/lib/prisma";
import type { AddFavoriteInput } from "./favorites.types";

export async function getFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function addFavorite(userId: string, input: AddFavoriteInput) {
  return prisma.favorite.upsert({
    where: { city_name_userId: { city_name: input.city_name, userId } },
    update: {},
    create: { ...input, userId },
  });
}

export async function removeFavorite(userId: string, id: string) {
  const favorite = await prisma.favorite.findFirst({ where: { id, userId } });
  if (!favorite) return null;
  return prisma.favorite.delete({ where: { id } });
}

export type { AddFavoriteInput };
