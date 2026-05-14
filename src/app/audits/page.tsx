import AuditsClient from "./AuditsClient";
import { getAudits } from "./actions";

export const dynamic = "force-dynamic";

export default async function AuditsPage() {
  const initialAudits = await getAudits();

  return <AuditsClient initialAudits={initialAudits} />;
}
