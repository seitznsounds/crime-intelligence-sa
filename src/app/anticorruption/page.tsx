import AnticorruptionClient from "./AnticorruptionClient";
import { 
  REPORTING_METRICS, 
  SOCIAL_NORM_METRICS, 
  ZONDO_PILLARS, 
  LEGISLATIVE_GAPS 
} from "@/lib/intelligence-metrics";
import { getOversightMetrics, getReformData, getWpuData } from "@/components/intel/actions";

export const dynamic = "force-dynamic";

export default async function AnticorruptionPage() {
  const oversightMetrics = await getOversightMetrics();
  const reformData = await getReformData();
  const wpuData = await getWpuData();
  
  const accountabilityKpis = {
    unpaid_invoices_total: "R 12.4 Bn",
    eastern_cape_failure: "R 3.8 Bn",
    doj_share: "49%",
    provincial_share: "97%",
    reporting_void: "11%", 
    fear_multiplier: "62%"
  };
  
  return (
    <AnticorruptionClient 
      reportingMetrics={REPORTING_METRICS}
      socialNormMetrics={SOCIAL_NORM_METRICS}
      zondoPillars={ZONDO_PILLARS}
      legislativeGaps={LEGISLATIVE_GAPS}
      oversightMetrics={oversightMetrics}
      reformData={reformData}
      accountabilityKpis={accountabilityKpis}
      wpuData={wpuData}
    />
  );
}

