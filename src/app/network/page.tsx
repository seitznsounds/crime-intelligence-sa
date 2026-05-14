import NetworkClient from "./NetworkClient";
import { getNetworkData } from "./actions";

export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  const initialData = await getNetworkData();

  return (
    <NetworkClient 
      initialNodes={initialData.nodes} 
      initialEdges={initialData.edges} 
    />
  );
}
