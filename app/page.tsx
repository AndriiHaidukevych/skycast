import { HomeScreen } from "@/src/screens/home";

interface Props {
  searchParams: Promise<{ city?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const { city } = await searchParams;
  return <HomeScreen initialCity={city} />;
}
