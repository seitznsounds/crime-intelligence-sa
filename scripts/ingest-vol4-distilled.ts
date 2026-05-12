import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const volumeNumber = 4;
const apifyRunId = 'qa2WsyFfeH5v0KABK';

const analyzedRecords = [
  {
    title: "Institutional Complicity: The Judiciary",
    summary: "TRC findings on how the South African judiciary and magistracy facilitated apartheid through a policy of deference to parliamentary sovereignty.",
    content: "The TRC institutional hearing on the legal community revealed a systemic failure of the judiciary to protect human rights. Judges and magistrates consistently deferred to the 'will of the lawgiver', implementing diabolically unjust apartheid laws under the guise of parliamentary sovereignty. The Commission found that judicial independence was largely a myth in the experience of the majority of South Africans.",
    event_date: "1997-10-27T00:00:00Z", // Date of the hearing
    category: "TRC_INSTITUTIONAL_AUDIT",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      institution: "Judiciary and Magistracy",
      key_finding: "Systemic Complicity",
      tags: ["Rule of Law", "Judiciary", "Institutional Decay"]
    }
  },
  {
    title: "Systemic Abuse: Detention Without Trial (1960-1990)",
    summary: "Stats and findings on the use of detention as a primary measure of state repression and intimidation.",
    content: "The Human Rights Committee estimated that 80,000 South Africans were detained between 1960 and 1990. Roughly 80% were released without charge, and only 4% were ever convicted, proving that detention was used primarily as a tool for intimidation and interrogation rather than justice. An estimated 20,000 detainees were tortured, and 73 deaths in detention were officially recorded under security legislation.",
    event_date: "1960-01-01T00:00:00Z",
    category: "TRC_INSTITUTIONAL_FINDING",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      stats: {
        total_detained: 80000,
        tortured_estimate: 20000,
        deaths_in_detention: 73
      },
      tags: ["Detention", "Torture", "Repression"]
    }
  },
  {
    title: "Legal Manipulation: Common Law Prosecutions",
    summary: "Findings on how the state used common law to mask the political nature of apartheid-era prosecutions.",
    content: "A senior government prosecutor admitted to the TRC that the state preferred to prosecute political cases under common law (e.g., arson, theft, murder) rather than statutory apartheid law. This strategy was designed to prevent international 'propaganda' and criticism, effectively criminalizing political resistance as ordinary crime while maintaining a facade of legal normality.",
    event_date: "1983-03-01T00:00:00Z",
    category: "TRC_LEGAL_AUDIT",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      entity: "National Prosecuting Authority (former)",
      strategy: "Common Law Masking",
      tags: ["Prosecution", "Legal Warfare", "Propaganda"]
    }
  },
  {
    title: "Institutional Audit: The Prisons Department",
    summary: "The role of the Department of Correctional Services as a site for interrogation, intimidation, and torture.",
    content: "Prisons served as the 'prime site for detention' during the apartheid era. The TRC found that the Prisons Department facilitated interrogation and torture, particularly during the early 1960s and 1976-1977. Despite its administrative role, the department was an integral part of the security apparatus, providing the physical space where gross violations were systematically carried out.",
    event_date: "1963-05-01T00:00:00Z", // Passing of 90-day clause
    category: "TRC_INSTITUTIONAL_AUDIT",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      institution: "Department of Correctional Services (Prisons)",
      violations: ["Facilitating Torture", "Illegal Detention"],
      tags: ["Prisons", "SAPS", "Institutional Complicity"]
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

  console.log("Ingestion complete. Volume 4 marked as INDEXED with institutional intelligence.");
}

ingestAnalyzedData().catch(console.error);
