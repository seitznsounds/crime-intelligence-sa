import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
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
    console.error('Record:', JSON.stringify(record, null, 2));
  } else {
    console.log(`✅ Successfully ingested record into ${tableName}`);
  }
}

async function run() {
  // Ingest Historical Record
  const historicalRecord = {
    id: randomUUID(),
    title: "Audit: South African Whistleblower Protection Regime Reforms (2023-2026)",
    summary: "Forensic analysis of the institutional decay and legislative reforms following the Zondo Commission. Highlights the lethal coordination gaps in the Witness Protection Unit and the introduction of financial incentives (15-25%) in the 2026 Protected Disclosures Bill.",
    content: "# Distilled Intelligence: Whistleblower Protection Regime reforms RSA (2023-2026)\n\n## Summary\nThe Zondo Commission identified the Protected Disclosures Act (PDA) as 'deficient'. The 2026 Protected Disclosures Bill aims to address this by introducing financial incentives and direct witness protection.\n\n## Key Institutions\n- DOJCD (Accounting Officer for NPA)\n- NPA (Operational lead for WPU)\n- WPU ( Witness Protection Unit)\n\n## Critical Failure\nThe 'Dual Home' arrangement for witness protection leads to leadership instability and lethal funding gaps.",
    event_date: "2023-06-29T00:00:00Z",
    category: "Corruption",
    metadata: {
        source_file: "20230629-Whistleblower-Protection-Regime-South-Africa.pdf",
        sprint: 5,
        protocol: "Agentic Intelligence Protocol"
    }
  };
  await ingestRecord('historical_records', historicalRecord);

  // Ingest Person
  const person = {
    id: randomUUID(),
    full_name: 'Adv. T Nkabinde',
    role: 'Director-General (Acting) of DOJCD / Official mentioned in whistleblower reforms',
    pep_tier: 2,
    status: 'ACTIVE',
    is_verified: true,
    metadata: {
        source: 'PPLAAF/DOJCD 2023 Discussion Document',
        context: 'Whistleblower reform advocacy',
        sprint: 5
    }
  };
  await ingestRecord('people', person);

  // Ingest Knowledge Base Entries
  const knowledgePoints = [
    {
      id: randomUUID(),
      content: "The 'Dual Home' Governance Crisis: The NPA is subordinate to the DOJCD, with the DG of Justice acting as the NPA's accounting officer, inhibiting operational autonomy and starving the WPU of resources.",
      source: 'NDPP Handover Report Jan 2026',
      source_type: 'Report',
      metadata: { impact: 'Lethal', entities: ['NPA', 'DOJCD', 'WPU'], sprint: 5 }
    },
    {
      id: randomUUID(),
      content: "2026 Whistleblower Incentives: The Protected Disclosures Bill (2026) proposes rewards of 15-25% of recovered funds for whistleblowers whose disclosures lead to successful prosecutions.",
      source: 'Protected Disclosures Bill 2026',
      source_type: 'Legislation',
      metadata: { provision: 'Financial Incentives', range: '15-25%', sprint: 5 }
    }
  ];

  for (const point of knowledgePoints) {
    await ingestRecord('ai_knowledge_base', point);
  }
}

run().catch(console.error);
