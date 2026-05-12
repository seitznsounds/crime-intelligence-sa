import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const volumeNumber = 5;
const apifyRunId = '1JKRLcAoR3bx4e2W1';

const analyzedRecords = [
  {
    title: "Final Finding: State Criminality under PW Botha",
    summary: "The TRC's definitive finding that the apartheid state, under PW Botha, descended into systemic criminality.",
    content: "The TRC concluded that former President PW Botha took the South African state into 'the realms of criminality'. His refusal to engage frankly with the Commission and his eventual conviction reflected a deep-seated disdain for democratic accountability. The state's security apparatus, under his leadership, was found responsible for gross human rights violations on a massive, institutionalized scale.",
    event_date: "1998-10-29T00:00:00Z", // Date of final report
    category: "TRC_FINAL_FINDING",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      perpetrator: "PW Botha",
      legal_finding: "State Criminality",
      tags: ["Accountability", "State Crimes", "PW Botha"]
    }
  },
  {
    title: "Primary Non-State Perpetrator: The IFP",
    summary: "Findings on the Inkatha Freedom Party's role in political violence and its collusion with the state.",
    content: "The TRC found the Inkatha Freedom Party (IFP) to be the primary non-state perpetrator of human rights violations, responsible for approximately 33% of all violations reported to the Commission. The IFP leadership was found to have actively discouraged members from applying for amnesty to hide high-level collusion in gross violations, effectively obstructing the pursuit of truth and justice.",
    event_date: "1998-10-29T00:00:00Z",
    category: "TRC_FINAL_FINDING",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      entity: "Inkatha Freedom Party (IFP)",
      stats: {
        violation_share: "33%"
      },
      tags: ["IFP", "Vigilantism", "Collusion", "Political Violence"]
    }
  },
  {
    title: "Institutional Failure: The Culture of Denial",
    summary: "TRC's critique of the SAP and SADF's refusal to acknowledge their roles in systemic atrocities.",
    content: "The TRC identified an 'overarching sense of denial' within the leadership of the SAP and SADF. Former generals and high-ranking officials submitted reports that ignored or minimized the massive scale of violations committed by their forces. This institutional denial was cited as a major hurdle to reconciliation and a primary reason for the 'chasm' between the powerful and the victims.",
    event_date: "1998-10-29T00:00:00Z",
    category: "TRC_INSTITUTIONAL_FINDING",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      entities: ["SAP", "SADF"],
      finding: "Institutional Denial",
      tags: ["SAPS", "SADF", "Cover-up", "Denialism"]
    }
  },
  {
    title: "Judicial Complicity and Accountability",
    summary: "Final conclusions on the failure of judges and magistrates to check executive power.",
    content: "The TRC's final findings lamented the refusal of judges to appear before the Commission, a decision that hindered the debate on transforming the judiciary. Magistrates were identified as having a 'dismal record' as servants of the apartheid state. The Commission emphasized that the legal system's failure to provide a check on executive power enabled the culture of impunity that led to thousands of violations.",
    event_date: "1998-10-29T00:00:00Z",
    category: "TRC_FINAL_FINDING",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      institution: "Judiciary",
      finding: "Institutional Complicity",
      tags: ["Judiciary", "Rule of Law", "Impunity"]
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
    console.warn("Failed to clear old records (might not exist):", deleteError.message);
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

  console.log("Ingestion complete. Volume 5 marked as INDEXED with definitive final findings.");
}

ingestAnalyzedData().catch(console.error);
