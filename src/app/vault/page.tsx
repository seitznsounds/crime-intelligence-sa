import VaultClient from "./VaultClient";
import { getEvidencePackages } from "@/lib/evidence-actions";

export const dynamic = "force-dynamic";

export default async function VaultPage() {
  const initialPackages = await getEvidencePackages();

  return <VaultClient initialPackages={initialPackages} />;
}
