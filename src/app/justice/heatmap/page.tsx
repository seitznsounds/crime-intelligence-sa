import LegalHeatmapClient from "./LegalHeatmapClient";
import { fetchLegalHeatmap } from "@/lib/intelligence-actions";

export const metadata = {
  title: "Judicial Intelligence Heatmap | Crime Intelligence SA",
  description: "Visualizing the density of criminal judgments across High Court divisions.",
};

export default async function HeatmapPage() {
  const { data, error } = await fetchLegalHeatmap();
  return <LegalHeatmapClient data={data || []} />;
}
