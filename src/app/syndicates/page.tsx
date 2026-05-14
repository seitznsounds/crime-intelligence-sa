import SyndicatesClient from "./SyndicatesClient";
import { getSyndicates } from "./actions";

export const dynamic = "force-dynamic";

export default async function SyndicatePage() {
  const initialSyndicates = await getSyndicates();

  return <SyndicatesClient initialSyndicates={initialSyndicates} />;
}
