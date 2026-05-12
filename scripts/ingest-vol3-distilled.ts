import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const volumeNumber = 3;
const apifyRunId = 'emtsHXQStEyWK4aVJ';

const analyzedRecords = [
  {
    title: "Death in Detention: Stephen Bantu Biko",
    summary: "Black Consciousness leader Steve Biko died in police custody after being brutally tortured at the Sanlam Building.",
    content: "On 12 September 1977, Stephen Bantu Biko died in the custody of law enforcement officials. The TRC found that his death was a gross human rights violation resulting from injuries sustained during detention. Magistrate Marthinus Prins had originally found no SAP implication, a decision the TRC cited as contributing to a 'culture of impunity' within the police force.",
    event_date: "1977-09-12T00:00:00Z",
    category: "TRC_VICTIM_PERSPECTIVE",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      location: "Port Elizabeth / Pretoria",
      victim: "Steve Biko",
      site: "Sanlam Building (Security Branch HQ)",
      legal_finding: "Gross Human Rights Violation",
      tags: ["Assassination", "Black Consciousness", "Torture"]
    }
  },
  {
    title: "Sanlam Building: Torture Headquarters",
    summary: "The Security Branch headquarters in Port Elizabeth was identified as a primary site for the torture and killing of activists.",
    content: "The TRC identified the Sanlam Building in Port Elizabeth as a central hub for the SAP Security Branch's illegal methods. Evidence showed that many activists were detained and systematically tortured there between 1976 and 1982. The Commission held the SAP and named officers responsible for the gross violations committed at this site.",
    event_date: "1976-01-01T00:00:00Z",
    category: "TRC_INSTITUTIONAL_FINDING",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      location: "Port Elizabeth",
      entity: "SAP Security Branch",
      site_type: "Torture Center",
      tags: ["Systemic Abuse", "SAPS", "Port Elizabeth"]
    }
  },
  {
    title: "Operation Katzen & Project Vallex",
    summary: "Covert Military Intelligence operations designed to incite 'colour against colour' violence in Eastern Cape townships.",
    content: "Military Intelligence projects 'Vallex' and 'Katzen' were covert operations aimed at creating a 'counter-revolutionary force' in towns like Somerset East and Cookhouse. The strategy involved recruiting and training vigilante groups to use force against UDF supporters, specifically following the principle of 'colour against colour' to destabilize resistance from within.",
    event_date: "1985-01-01T00:00:00Z",
    category: "TRC_STATE_REPRESSION",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      location: "Somerset East / Cookhouse / Cradock",
      entity: "Military Intelligence (SADF)",
      operations: ["Project Vallex", "Operation Katzen"],
      tags: ["Vigilantism", "Covert Operations", "Divide and Rule"]
    }
  },
  {
    title: "Vigilante Collusion: Rev. Mzwandile Maqina",
    summary: "A religious leader in Port Elizabeth who colluded with the SAP/SADF to violently attack UDF supporters.",
    content: "The TRC found that Reverend Mzwandile Ebenezer Maqina was a key figure in the state's 'contra-mobilisation' policy. Between 1985 and 1990, Maqina formed vigilante groups that colluded with the SAP and SADF to perpetrate violence, including killings and arson, against members of the United Democratic Front (UDF) in Port Elizabeth.",
    event_date: "1985-06-01T00:00:00Z",
    category: "TRC_VIGILANTISM",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      location: "Port Elizabeth",
      perpetrator: "Mzwandile Ebenezer Maqina",
      allies: ["SAP", "SADF"],
      victim_group: "UDF Supporters",
      tags: ["Collusion", "Vigilantism", "State-Sponsored Violence"]
    }
  },
  {
    title: "Assassination of the Cradock Four",
    summary: "State-sponsored abduction and murder of four anti-apartheid activists: Matthew Goniwe, Fort Calata, Sparrow Mkhonto, and Sicelo Mhlauli.",
    content: "In June 1985, four prominent activists from Cradock were intercepted at a police roadblock and murdered by security forces. Matthew Goniwe, a key UDF organizer, was seen by the state as the 'epicentre' of the revolutionary onslaught in the Eastern Cape. Their deaths became a symbol of the state's policy of eliminating political opponents through extrajudicial killing.",
    event_date: "1985-06-27T00:00:00Z",
    category: "TRC_ASSASSINATION",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      location: "Cradock / Port Elizabeth",
      victims: ["Matthew Goniwe", "Fort Calata", "Sparrow Mkhonto", "Sicelo Mhlauli"],
      tags: ["Assassination", "Cradock Four", "UDF"]
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

  console.log("Ingestion complete. Volume 3 marked as INDEXED with victim-focused intelligence.");
}

ingestAnalyzedData().catch(console.error);
