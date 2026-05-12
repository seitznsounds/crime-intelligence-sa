import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: { schema: 'public' }
  }
);

async function ingestRecord(tableName: string, record: any) {
  const { error } = await supabase
    .from(tableName)
    .upsert(record, { onConflict: 'id' });

  if (error) {
    console.error(`❌ Error ingesting into ${tableName}:`, error.message);
  } else {
    console.log(`✅ Successfully ingested record into ${tableName}`);
  }
}

async function run() {
  // 1. Ingest Historical Record (The Act)
  const historicalRecord = {
    id: randomUUID(),
    title: "Legislation: Witness Protection Act 112 of 1998",
    summary: "The foundational statutory framework for witness protection in South Africa. Establishes the Office for Witness Protection (OWP) and mandates life-imprisonment level penalties for security breaches.",
    content: "# Witness Protection Act 112 of 1998\n\n## Core Mandate\nTo provide for the establishment of an Office for the protection of witnesses; to regulate the powers of the Director; and to provide for temporary protection.\n\n## Key Provisions\n- Sec 10(2): Director has full access to police dockets.\n- Sec 17: Strict confidentiality oath for OWP members.\n- Sec 22: Offences and 30-year penalties for identity disclosure.",
    event_date: "1998-11-27T00:00:00Z",
    category: "Legislation",
    metadata: {
        source_file: "Act No.112, 1998 Witness Protection Act.pdf",
        status: "ACTIVE",
        sprint: 5
    }
  };
  await ingestRecord('historical_records', historicalRecord);

  // 2. Ingest High-Profile Targets (Whistleblowers)
  const targets = [
    {
      id: randomUUID(),
      full_name: 'Athol Williams',
      role: 'Bain & Co Whistleblower / SARS Intelligence Source',
      pep_tier: 1,
      status: 'EXILED',
      metadata: { 
        threat_level: 'EXTREME', 
        status_note: 'Fled South Africa Nov 2021 citing OWP abandonment.',
        sprint: 5
      }
    },
    {
      id: randomUUID(),
      full_name: 'Themba Maseko',
      role: 'Former GCIS CEO / State Capture Whistleblower',
      pep_tier: 1,
      status: 'ACTIVE',
      metadata: { 
        economic_status: 'Blacklisted', 
        context: 'Resisted Gupta-led state capture of government advertising.',
        sprint: 5
      }
    },
    {
      id: randomUUID(),
      full_name: 'Babita Deokaran',
      role: 'Gauteng Health Dept Official / Tembisa Hospital Whistleblower',
      pep_tier: 2,
      status: 'DECEASED',
      metadata: { 
        cause_of_death: 'Assassinated', 
        date_of_death: '2021-08-23',
        sprint: 5
      }
    }
  ];

  for (const target of targets) {
    await ingestRecord('people', target);
  }

  // 3. Ingest Intelligence Knowledge Base (Structural Failures)
  const intelligence = [
    {
      id: randomUUID(),
      content: "OWP Operational Collapse (2025): 32% vacancy rate within the Office for Witness Protection due to job evaluation freezes and funding 'hoarding' by the DOJCD.",
      source: 'ActionSA Memorandum June 2025',
      source_type: 'Intelligence',
      metadata: { vacancy_rate: '32%', entity: 'OWP', sprint: 5 }
    },
    {
      id: randomUUID(),
      content: "The 'Aftercare' Gap: Witnesses under the 1998 Act are frequently trapped in safe houses for years because the state lacks a consolidated mandate for permanent identity relocation and civil reintegration.",
      source: 'NPA Annual Report 2025',
      source_type: 'Report',
      metadata: { friction: 'Dual Home crisis', sprint: 5 }
    }
  ];

  for (const item of intelligence) {
    await ingestRecord('ai_knowledge_base', item);
  }
}

run().catch(console.error);
