import { DetailsScreen } from "@/src/screens/details";

interface Props {
  params: Promise<{ city: string }>;
}

export default async function DetailsPage({ params }: Props) {
  const { city } = await params;
  return <DetailsScreen city={decodeURIComponent(city)} />;
}
