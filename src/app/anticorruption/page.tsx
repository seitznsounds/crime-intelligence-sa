import AnticorruptionClient from "./AnticorruptionClient";
import { 
  REPORTING_METRICS, 
  SOCIAL_NORM_METRICS, 
  ZONDO_PILLARS, 
  LEGISLATIVE_GAPS 
} from "@/lib/intelligence-metrics";
import { getOversightMetrics, getReformData, getAccountabilityKpis, getWpuData } from "@/components/intel/actions";

export const dynamic = "force-dynamic";

export default async function AnticorruptionPage() {
  const oversightMetrics = await getOversightMetrics();
  const reformData = await getReformData();
  const accountabilityKpis = await getAccountabilityKpis();
  const wpuData = await getWpuData();
  
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
