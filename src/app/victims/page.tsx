import VictimsClient from "./VictimsClient";
import { getVictims } from "./actions";

export const dynamic = "force-dynamic";

export default async function VictimsPage() {
  const initialVictims = await getVictims();

  return <VictimsClient initialVictims={initialVictims} />;
}
