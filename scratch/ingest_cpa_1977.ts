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
    console.error('Record:', JSON.stringify(record, null, 2));
  } else {
    console.log(`✅ Successfully ingested record into ${tableName}`);
  }
}

async function run() {
  // 1. Ingest Historical Record (Legislative Framework)
  const historicalRecord = {
    id: randomUUID(),
    title: "Forensic Audit: Criminal Procedure Act 51 of 1977 (Loophole Matrix)",
    summary: "Systematic analysis of the CPA 1977 procedural mechanisms. Focuses on Section 185 (Detention of Witnesses), Section 204 (State Witness Indemnity), and Section 205 (Compulsory Information Disclosure) as utilized during the State Capture era.",
    content: "# Criminal Procedure Act 51 of 1977: Intelligence Audit\n\n## Section 185 (Detention of Witness)\nAllows detention of state witnesses for up to 6 months. Historically weaponized to isolate whistleblowers.\n\n## Section 204 (Indemnity)\nOffers immunity for 'frank and honest' testimony. Utilized by syndicate runners to secure assets while offering limited disclosure.\n\n## Section 205 (Subpoena)\nCompels information disclosure. Often used to pressure journalists and whistleblowers to reveal sources before they reach official investigative bodies.",
    event_date: "1977-05-01T00:00:00Z", // Original Act Date
    category: "Legal Framework",
    metadata: {
        source_file: "Criminal Procedure Act 51 of 1977 1977-051.pdf",
        sprint: 5,
        protocol: "Agentic Intelligence Protocol",
        risk_areas: ["Witness Coercion", "Selective Prosecution", "Source Exposure"]
    }
  };
  await ingestRecord('historical_records', historicalRecord);

  // 2. Ingest Knowledge Base Entries (Specific Provisions for RAG/Calculator)
  const knowledgePoints = [
    {
      id: randomUUID(),
      content: "CPA Section 185: Detention of Witness. Provides the State with the power to detain a witness in 'private' for up to 6 months if there is a perceived danger of tampering or absconding. This lack of transparency is a core vulnerability in whistleblower protection.",
      source: 'Criminal Procedure Act 51 of 1977',
      source_type: 'Legislation',
      metadata: { section: '185', category: 'Coercion Risk', sprint: 5 }
    },
    {
      id: randomUUID(),
      content: "CPA Section 204: Indemnity from Prosecution. A prosecutor may call a witness to answer incriminating questions under the promise of discharge from prosecution if they testify 'frankly and honestly'. This mechanism is frequently used in high-level corruption cases to dismantle syndicates from the bottom up.",
      source: 'Criminal Procedure Act 51 of 1977',
      source_type: 'Legislation',
      metadata: { section: '204', category: 'Immunity Mechanism', sprint: 5 }
    },
    {
      id: randomUUID(),
      content: "CPA Section 205: Compulsory Evidence. A judge or magistrate can require a person likely to have material information on an offence to appear for examination. Failure to provide information can lead to imprisonment under Section 189.",
      source: 'Criminal Procedure Act 51 of 1977',
      source_type: 'Legislation',
      metadata: { section: '205', category: 'Information Compulsion', sprint: 5 }
    }
  ];

  for (const point of knowledgePoints) {
    await ingestRecord('ai_knowledge_base', point);
  }

  console.log("🚀 Ingestion of CPA 1977 Intelligence Completed.");
}

run().catch(console.error);
