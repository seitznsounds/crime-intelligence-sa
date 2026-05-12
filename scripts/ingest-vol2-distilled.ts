import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const volumeNumber = 2;
const apifyRunId = 'EysDk8rF6h6JfpgRG';

const analyzedRecords = [
  // --- Original Records ---
  {
    title: "Battle of Athlone: Death of Anton Fransch",
    summary: "ANC guerrilla fighter Anton Fransch was killed following a massive 6-hour gun-battle with apartheid special forces in Athlone, Cape Town.",
    content: "Anton Fransch was born and raised in Bonteheuwel, Cape Town. On the 17th Nov 1989, he was surrounded by special forces of the apartheid regime. Despite the overwhelming force, he held his position for six hours before being killed. This event is documented in TRC Volume 2 as a key example of the state's military response to resistance.",
    event_date: "1989-11-17T00:00:00Z",
    category: "TRC_REPORT",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      location: "Athlone, Cape Town",
      perpetrators: ["Apartheid Special Forces"],
      victim: "Anton Fransch",
      tags: ["Assassination", "Gun-battle", "Resistance"]
    }
  },
  {
    title: "SA Air Force Operation - TRC Testimony",
    summary: "Testimony provided to the TRC regarding a cowardly SA Air Force operation in May 1998.",
    content: "During the TRC hearings in 1998, witnesses described a specific SA Air Force operation. The Star reported on May 15, 1998, that the TRC was told the bomb attack was 'cowardly'. This falls under the TRC's investigation into state-sponsored violence and bombings.",
    event_date: "1998-05-15T00:00:00Z",
    category: "TRC_REPORT",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      source: "The Star",
      reporter: "Ross Morthey",
      tags: ["Bombing", "SADF", "Air Force"]
    }
  },
  {
    title: "Amnesty Hearing: Johannes (Molefe) Mnisi",
    summary: "Amnesty hearings for Johannes Mnisi regarding actions taken during the liberation struggle.",
    content: "Johannes (Molefe) Mnisi appeared before the TRC Amnesty Committee on 10 April 1997 and 8 May 1998. The hearings detailed his involvement in MK operations and sought disclosure for political crimes committed during the 1980s.",
    event_date: "1997-04-10T00:00:00Z",
    category: "TRC_REPORT",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      person: "Johannes Mnisi",
      hearing_part: 3,
      tags: ["Amnesty", "MK", "Disclosure"]
    }
  },
  {
    title: "Amnesty Decision: Helene Pastoors",
    summary: "The TRC Amnesty Committee delivered its decision on Helene Pastoors on 24 January 2001.",
    content: "Helene Pastoors, a known anti-apartheid activist involved in ANC logistics, received her amnesty decision in 2001. Her case highlights the international dimensions of the struggle and the TRC's role in evaluating the actions of non-combatant supporters.",
    event_date: "2001-01-24T00:00:00Z",
    category: "TRC_REPORT",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      person: "Helene Pastoors",
      tags: ["Amnesty", "ANC", "International"]
    }
  },

  // --- New Distilled Records (Chapter 6: Samora Machel) ---
  {
    title: "President Samora Machel Aircraft Crash (Mbuzini)",
    summary: "Mozambican presidential aircraft Tupolev TU 134A-3 crashed near Mbuzini, killing President Samora Machel and 24 others.",
    content: "On 19 October 1986, President Samora Machel died when his aircraft crashed in the Lebombo Mountains near the Swaziland/Mozambique/SA border. While the Margo Commission blamed pilot error, the TRC investigation highlighted significant circumstantial evidence suggesting state interference, including cabinet-level tensions and security force actions at the crash site.",
    event_date: "1986-10-19T00:00:00Z",
    category: "TRC_INVESTIGATION",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      location: "Mbuzini, Lebombo Mountains",
      victims: ["Samora Machel", "Graça Machel (Survivor)"],
      investigated_entities: ["SADF", "National Intelligence Service", "Malawi Government"],
      tags: ["Assassination", "Aviation", "Geopolitical"]
    }
  },
  {
    title: "Security Force Interference: Mbuzini Crash Site",
    summary: "Evidence of South African security forces rummaging through the Machel crash wreckage and confiscating documents.",
    content: "Testimony from survivors and witnesses, including a nurse, stated that security forces arrived early at the Mbuzini crash site and chased away help. Foreign Minister Pik Botha and NIS head Niel Barnard admitted that documents were removed from the scene for 'copying'. General Lothar Neethling significantly delayed the Margo enquiry by refusing to hand over the cockpit voice recorder.",
    event_date: "1986-10-20T00:00:00Z",
    category: "TRC_INVESTIGATION",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      location: "Mbuzini",
      key_figures: ["Pik Botha", "Niel Barnard", "Lothar Neethling"],
      tags: ["Evidence Tampering", "SAPS", "NIS"]
    }
  },
  {
    title: "The Decoy Beacon (VOR) Allegation",
    summary: "Investigation into the use of a mobile decoy beacon to lure Samora Machel's plane off-course.",
    content: "The Soviet team investigating the Mbuzini crash concluded that a decoy beacon caused the aircraft to stray 37 degrees off-course. The TRC received testimony from a SAAF flight sergeant who saw a friend building a mobile beacon at 4AD Snake Valley (Pretoria) in the month before the crash. The beacon reportedly left the base on the weekend of the crash and was returned shortly after.",
    event_date: "1986-10-19T00:00:00Z",
    category: "TRC_INVESTIGATION",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      location: "Maputo / Matsapa",
      entities: ["SAAF", "4AD Snake Valley", "Directorate of Civil Aviation"],
      tags: ["Electronic Warfare", "Assassination", "Technological Espionage"]
    }
  },
  {
    title: "Recruitment of Maputo Control Tower Personnel",
    summary: "Allegations of South African security forces recruiting Mozambican airport officials prior to the Machel crash.",
    content: "Intelligence reports indicated that South African security forces sought to recruit officials at the Maputo control tower. Specifically, Mr Cornelio Vasco Cumbe (alias Roberto Santos Macuacua) was allegedly recruited. This recruitment would have been essential to the success of a decoy beacon operation by ensuring Maputo's own VOR beacon was deactivated or ignored.",
    event_date: "1986-09-01T00:00:00Z",
    category: "TRC_INVESTIGATION",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      location: "Maputo Airport",
      perpetrators: ["Major Craig Williamson", "South African Security Forces"],
      tags: ["Intelligence", "Infiltration", "Foreign Intervention"]
    }
  },
  {
    title: "State Security Council: Destabilization of Mozambique",
    summary: "Cabinet-level discussions regarding the overthrow of the FRELIMO government and assistance to RENAMO.",
    content: "SSC minutes from 1984 record discussions by the Mozambican working group, including General Jac Buchner and Major Craig Williamson, on helping RENAMO overthrow the Mozambican government. These discussions demonstrate a long-standing state policy of hostile intervention in Mozambique, providing a clear motive for the assassination of President Samora Machel.",
    event_date: "1984-01-01T00:00:00Z",
    category: "TRC_INVESTIGATION",
    backfill_source: `TRC_VOL_${volumeNumber}`,
    apify_run_id: apifyRunId,
    metadata: {
      entities: ["State Security Council", "RENAMO", "FRELIMO"],
      key_figures: ["PW Botha", "Magnus Malan", "Craig Williamson"],
      tags: ["Systemic Corruption", "State Terrorism", "Geopolitics"]
    }
  }
];

async function ingestAnalyzedData() {
  console.log(`Ingesting ${analyzedRecords.length} high-fidelity analyzed records for Vol ${volumeNumber}...`);
  
  // First, clear any existing records for this volume to avoid duplicates if re-running
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

  // Update volume status to INDEXED
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

  console.log("Ingestion complete. Volume 2 marked as INDEXED with expanded intelligence.");
}

ingestAnalyzedData().catch(console.error);
