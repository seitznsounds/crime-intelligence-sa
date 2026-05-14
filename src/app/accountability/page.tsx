import AccountabilityClient from "./AccountabilityClient";
import { getTrcVolumes } from "./actions";
import { createServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AccountabilityPage() {
  const initialVolumes = await getTrcVolumes();
  
  const supabase = await createServerClient();
  const { data: initialPerpetrators } = await supabase
    .from("humanity_crimes_perpetrators")
    .select("*")
    .order("risk_rank", { ascending: false });

  return (
    <AccountabilityClient 
      initialVolumes={initialVolumes} 
      initialPerpetrators={initialPerpetrators || []} 
    />
  );
}
