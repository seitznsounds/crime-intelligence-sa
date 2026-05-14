import AmnestyClient from "./AmnestyClient";
import { getAmnestyApplications } from "./actions";

export const dynamic = "force-dynamic";

export default async function AmnestyPage() {
  const initialApplications = await getAmnestyApplications();

  return <AmnestyClient initialApplications={initialApplications} />;
}
