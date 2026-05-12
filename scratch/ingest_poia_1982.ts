
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestPOIA1982() {
  console.log('🚀 Starting Ingestion of Protection of Information Act 1982 Intelligence...');

  const records = [
    {
      id: crypto.randomUUID(),
      title: "POIA Section 4: The Secrecy Trap",
      summary: "Criminalizes unauthorized disclosure of information deemed a 'security matter' or 'secret official code'. Used to prosecute whistleblowers.",
      content: "Section 4 of the Protection of Information Act (POIA) 1982 is the primary legal instrument used to punish the disclosure of classified information. It carries a penalty of up to 10 years imprisonment. Its broad application allows for the suppression of evidence related to state capture if that evidence is unilaterally classified as a 'security matter' by the state.",
      category: "Secrecy Risk",
      metadata: {
        act_no: "84 of 1982",
        section: "4",
        penalty_max: "10 years",
        abuse_vector: "Whistleblower Intimidation",
        source: "PPLAAF / POIA 1982"
      }
    },
    {
      id: crypto.randomUUID(),
      title: "POIA Section 8/10: Presumption of Prejudicial Purpose",
      summary: "Reverses the burden of proof, requiring the accused to prove they did NOT intend to harm the security of the Republic.",
      content: "Sections 8 and 10 of POIA 1982 create legal presumptions that any unauthorized communication with a suspected 'agent' or foreign body was done for a purpose prejudicial to the security of South Africa. This effectively forces the accused to prove their innocence regarding their intent, a radical departure from constitutional norms often utilized in political trials.",
      category: "Systemic Injustice",
      metadata: {
        act_no: "84 of 1982",
        sections: "8, 10",
        legal_status: "Reversed Burden of Proof",
        source: "PPLAAF / POIA 1982"
      }
    },
    {
      id: crypto.randomUUID(),
      title: "POIA Section 13: In Camera Trials",
      summary: "Allows for secret criminal proceedings where the public is excluded for 'security' reasons.",
      content: "Section 13 empowers courts to hold trials behind closed doors (in camera) when the case involves security matters. This provision significantly impairs public accountability and transparency, particularly in cases involving high-level state corruption or intelligence agency misconduct.",
      category: "Transparency Block",
      metadata: {
        act_no: "84 of 1982",
        section: "13",
        mechanism: "Secret Trials",
        source: "PPLAAF / POIA 1982"
      }
    }
  ];

  for (const record of records) {
    // 1. Ingest into historical_records
    const { error: histError } = await supabase
      .from('historical_records')
      .upsert({
        id: record.id,
        title: record.title,
        summary: record.summary,
        content: record.content,
        event_date: '1982-06-16',
        category: 'Legislation',
        location_text: 'National',
        source_url: 'PPLAAF/POIA_1982',
        metadata: record.metadata
      });

    if (histError) console.error('❌ Error ingesting historical_record:', histError);
    else console.log(`✅ Successfully ingested record into historical_records: ${record.title}`);

    // 2. Ingest into ai_knowledge_base
    const { error: kbError } = await supabase
      .from('ai_knowledge_base')
      .upsert({
        content: `${record.title}\n\n${record.content}`,
        metadata: { ...record.metadata, title: record.title, category: record.category },
        source: 'Protection of Information Act 1982'
      });

    if (kbError) console.error('❌ Error ingesting ai_knowledge_base:', kbError);
    else console.log(`✅ Successfully ingested record into ai_knowledge_base: ${record.title}`);
  }

  console.log('🚀 Ingestion of POIA 1982 Intelligence Completed.');
}

ingestPOIA1982();
