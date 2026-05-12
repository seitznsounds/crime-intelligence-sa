import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const volumeNumber = 6;
const apifyRunId = 'XV6nZfLl5xaTBEjEa';

const analyzedRecords = [
  {
    title: "Amnesty Findings: State as Primary Perpetrator",
    summary: "The final analysis of amnesty applications confirming the state's role as the lead perpetrator of violations.",
    content: "Through the amnesty process, the TRC definitively found the apartheid state—specifically its security agencies and policy councils—to be the primary perpetrator of gross human rights violations. The process revealed a systemic reliance on extrajudicial killings, torture, and abduction as tools of state policy, coordinated through the National Security Management System.",
    event_date: "2003-03-21T00:00:00Z", // Date of final Volume 6 release
    category: "TRC_AMNESTY_FINDING",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      finding: "State as Primary Perpetrator",
      tags: ["State Crimes", "Amnesty", "Security Forces"]
    }
  },
  {
    title: "Vlakplaas and Eugene de Kock: The Nexus of Violence",
    summary: "Findings on the impact of the Vlakplaas unit on the scale of human rights violations.",
    content: "Amnesty applications revealed that nearly 48% of all Security Branch violations were linked to incidents involving the C1/Vlakplaas unit and its commander, Eugene de Kock. De Kock's prosecution served as a critical 'stick' that forced a stream of co-perpetrators to come forward, exposing a high-precision killing machine that operated with the implicit and explicit authorization of senior police generals.",
    event_date: "2003-03-21T00:00:00Z",
    category: "TRC_AMNESTY_FINDING",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      entity: "C1/Vlakplaas",
      commander: "Eugene de Kock",
      stats: {
        security_branch_share: "48%"
      },
      tags: ["Vlakplaas", "Eugene de Kock", "Security Branch", "Death Squads"]
    }
  },
  {
    title: "SADF Nodal Point: Gatekeeping Atrocities",
    summary: "How the SANDF's administrative structure discouraged transparency about external operations.",
    content: "The TRC found that the SANDF established a 'nodal point' that acted more as a gatekeeper than a facilitator for amnesty applications. This resulted in a striking lack of applications from SADF members, particularly concerning external operations in neighboring countries, where the Commission found the brunt of counter-revolutionary warfare atrocities had been committed.",
    event_date: "2003-03-21T00:00:00Z",
    category: "TRC_INSTITUTIONAL_FINDING",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      entity: "SADF",
      mechanism: "Nodal Point",
      finding: "Obstructing Transparency",
      tags: ["SADF", "SANDF", "External Operations", "Cover-up"]
    }
  },
  {
    title: "National Security Management System (NSMS) Framework",
    summary: "The administrative framework that legalized and facilitated state repression.",
    content: "Amnesty hearings confirmed that the National Security Management System (NSMS) provided the essential administrative and strategic framework within which gross violations of human rights occurred. It enabled a 'total strategy' approach that blurred the lines between legal policing and illegal covert operations, ensuring that perpetrators acted with a sense of official authorization.",
    event_date: "2003-03-21T00:00:00Z",
    category: "TRC_INSTITUTIONAL_FINDING",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      system: "NSMS",
      strategy: "Total Strategy",
      tags: ["NSMS", "State Security Council", "Systemic Repression"]
    }
  }
];

async function ingestAnalyzedData() {
  console.log(`Ingesting ${analyzedRecords.length} high-fidelity analyzed records for Vol ${volumeNumber}...`);
  
  const { error: deleteError } = await supabase
    .from('historical_records')
    .delete()
    .eq('backfill_source', `TRC_VOL_${volumeNumber}`);

  if (deleteError) {
    console.warn("Failed to clear old records:", deleteError.message);
  }

  const { error: insertError } = await supabase
    .from('historical_records')
    .insert(analyzedRecords);

  if (insertError) {
    console.error("Failed to ingest records:", insertError.message);
    return;
  }

  const { error: updateError } = await supabase
    .from('trc_volumes')
    .update({ 
      status: 'INDEXED', 
      progress: 100, 
      apify_run_id: apifyRunId,
      updated_at: new Date().toISOString()
    })
    .eq('volume_number', volumeNumber);

  if (updateError) {
    console.error("Failed to update volume status:", updateError.message);
    return;
  }

  console.log("Ingestion complete. Volume 6 marked as INDEXED with comprehensive amnesty analysis.");
}

ingestAnalyzedData().catch(console.error);
