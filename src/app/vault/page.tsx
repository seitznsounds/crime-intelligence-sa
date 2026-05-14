import VaultClient from "./VaultClient";
import { getSealedPackages } from "./actions";

export const dynamic = "force-dynamic";

export default async function VaultPage() {
  const initialPackages = await getSealedPackages();

  return <VaultClient initialPackages={initialPackages} />;
}
