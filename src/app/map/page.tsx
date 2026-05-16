import MapClient from "./MapClient";
import { getHotspots, getTemporalData } from "./actions";

export const dynamic = "force-dynamic";

export default async function CrimeMapPage() {
  const [initialHotspots, temporalData] = await Promise.all([
    getHotspots(),
    getTemporalData()
  ]);

  return <MapClient initialHotspots={initialHotspots} temporalData={temporalData} />;
}
