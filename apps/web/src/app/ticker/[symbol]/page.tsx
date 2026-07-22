import { redirect } from "next/navigation";

export default async function LegacyTickerPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  redirect(`/stock/${symbol}`);
}
