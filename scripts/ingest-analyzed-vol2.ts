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
  }
];

async function ingestAnalyzedData() {
  console.log(`Ingesting ${analyzedRecords.length} analyzed records for Vol ${volumeNumber}...`);
  
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
    .update({ status: 'INDEXED', progress: 100 })
    .eq('volume_number', volumeNumber);

  if (updateError) {
    console.error("Failed to update volume status:", updateError.message);
    return;
  }

  console.log("Ingestion complete. Volume 2 marked as INDEXED.");
}

ingestAnalyzedData().catch(console.error);
