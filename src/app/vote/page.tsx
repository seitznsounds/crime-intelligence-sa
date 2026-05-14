import VoteClient from "./VoteClient";
import { getProposals } from "./actions";

export const dynamic = "force-dynamic";

export default async function VotePage() {
  const initialProposals = await getProposals();

  return <VoteClient initialProposals={initialProposals} />;
}
