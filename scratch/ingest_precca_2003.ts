
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestPRECCA2003() {
  console.log('🚀 Starting Ingestion of PRECCA 2003 Intelligence...');

  const records = [
    {
      id: crypto.randomUUID(),
      title: "PRECCA Section 34: Mandatory Reporting Duty",
      summary: "Statutory duty on persons in positions of authority (DGs, CEOs, Managers) to report corruption/fraud/theft exceeding R100,000. Failure to report is a criminal offence.",
      content: "Section 34 of the Prevention and Combating of Corrupt Activities Act (PRECCA) 2003 creates a legal obligation for anyone in a 'position of authority' to report suspected corrupt activities to the South African Police Service if the value exceeds R100,000. This includes Directors-General, Municipal Managers, and Company Directors. This is a critical baseline for whistleblower vulnerability assessment.",
      category: "Legal Framework",
      metadata: {
        act_no: "12 of 2004",
        section: "34",
        threshold: 100000,
        enforcement_risk: "High",
        source: "PPLAAF / PRECCA 2003"
      }
    },
    {
      id: crypto.randomUUID(),
      title: "PRECCA Section 11: Witness & Evidence Protection",
      summary: "Criminalizes the destruction, alteration, or concealment of evidence, specifically mentioning police dockets.",
      content: "Section 11 explicitly criminalizes the interference with witnesses or the tampering with evidential material. It specifically targets the destruction or concealment of a 'police docket' or other records to impair their availability for trial. This is a primary weapon used by syndicates to dismantle cases through internal police corruption.",
      category: "Coercion Risk",
      metadata: {
        act_no: "12 of 2004",
        section: "11",
        risk_vector: "Docket Tampering",
        source: "PPLAAF / PRECCA 2003"
      }
    },
    {
      id: crypto.randomUUID(),
      title: "PRECCA Section 28: Register for Tender Defaulters",
      summary: "Legal mechanism to bar corrupt enterprises and individuals from government contracts for 10-15 years.",
      content: "Section 28 provides for a Register for Tender Defaulters. When a person or enterprise is convicted of corruption related to a tender or contract, the court may endorse the Register. Endorsement results in a prohibition from participating in government tenders for a period of 10 to 15 years. This mechanism is key to disrupting the financial flow of state capture syndicates.",
      category: "Asset Recovery",
      metadata: {
        act_no: "12 of 2004",
        section: "28",
        sanction_type: "Debarment",
        source: "PPLAAF / PRECCA 2003"
      }
    }
  ];

  for (const record of records) {
    // 1. Ingest into historical_records for transparency
    const { error: histError } = await supabase
      .from('historical_records')
      .upsert({
        id: record.id,
        title: record.title,
        summary: record.summary, // Fixed column name
        content: record.content,
        event_date: '2004-04-27',
        category: 'Legislation',
        location_text: 'National', // Fixed column name if location doesn't exist (checking schema... it is location_text)
        source_url: 'PPLAAF/PRECCA_2003',
        metadata: record.metadata
      });

    if (histError) console.error('❌ Error ingesting historical_record:', histError);
    else console.log(`✅ Successfully ingested record into historical_records: ${record.title}`);

    // 2. Ingest into ai_knowledge_base for RAG
    const { error: kbError } = await supabase
      .from('ai_knowledge_base')
      .upsert({
        content: `${record.title}\n\n${record.content}`, // Combine title and content
        metadata: { ...record.metadata, title: record.title, category: record.category },
        source: 'PRECCA 2003'
      });

    if (kbError) console.error('❌ Error ingesting ai_knowledge_base:', kbError);
    else console.log(`✅ Successfully ingested record into ai_knowledge_base: ${record.title}`);
  }

  console.log('🚀 Ingestion of PRECCA 2003 Intelligence Completed.');
}

ingestPRECCA2003();
