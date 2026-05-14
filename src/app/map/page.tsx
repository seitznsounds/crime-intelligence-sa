import MapClient from "./MapClient";
import { getHotspots } from "./actions";

export const dynamic = "force-dynamic";

export default async function CrimeMapPage() {
  const initialHotspots = await getHotspots();

  return <MapClient initialHotspots={initialHotspots} />;
}
