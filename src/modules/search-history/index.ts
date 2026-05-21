import { prisma } from "@/src/lib/prisma";
import { MAX_SEARCH_HISTORY } from "@/src/lib/constants";

export async function saveSearch(searchTerm: string, userId?: string) {
  await prisma.searchHistory.create({
    data: { search_term: searchTerm, userId: userId ?? null },
  });
}

export async function getRecentSearches(userId: string): Promise<string[]> {
  const rows = await prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
    take: MAX_SEARCH_HISTORY,
    distinct: ["search_term"],
    select: { search_term: true },
  });
  return rows.map((r) => r.search_term);
}

export async function deleteSearch(id: string, userId: string) {
  await prisma.searchHistory.deleteMany({ where: { id, userId } });
}
