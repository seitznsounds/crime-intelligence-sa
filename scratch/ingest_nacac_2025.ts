
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestNACAC2025() {
  console.log('🚀 Starting Ingestion: NACAC August 2025 Final Report...');

  // 1. Organizations (Institutional Reform Entities)
  const organizations = [
    { name: "Office of Public Integrity (OPI)", type: "government", status: "unknown", description: "Proposed Chapter 9 anti-corruption body to replace/absorb SIU." },
    { name: "National Police Board (NPB)", type: "government", status: "unknown", description: "Proposed oversight board for SAPS leadership appointments." },
    { name: "Case Management Committee (CMC)", type: "government", status: "unknown", description: "Proposed inter-agency coordinating body for serious corruption cases." },
    { name: "National Anti-Corruption Advisory Council (NACAC)", type: "government", status: "active", description: "Presidential advisory council for the NACS 2020-2030." }
  ];

  const orgMap: Record<string, string> = {};
  for (const org of organizations) {
    const { data, error } = await supabase
      .from('organizations')
      .upsert({ name: org.name, type: org.type, status: org.status, description: org.description, metadata: { source: "NACAC Final Report 2025" } }, { onConflict: 'name' })
      .select('id').single();
    if (error) console.error(`❌ Org error: ${org.name}`, error);
    else orgMap[org.name] = data.id;
  }

  // 2. People (NACAC Leadership)
  const people = [
    { name: "Firoz Cachalia", role: "Chairperson, NACAC", pep: 2, desc: "Professor and lead architect of the OPI proposal.", verified: true },
    { name: "Thandeka Gqubule-Mbeki", role: "NACAC Member", pep: 3, desc: "Investigative journalist and whistleblower advocate.", verified: true },
    { name: "Kavisha Pillay", role: "NACAC Member", pep: 3, desc: "Anti-corruption activist from Corruption Watch.", verified: true }
  ];

  for (const p of people) {
    const { data: existing } = await supabase.from('people').select('id').eq('full_name', p.name).maybeSingle();
    
    if (existing) {
      await supabase.from('people').update({
        role: p.role,
        pep_tier: p.pep,
        description: p.desc,
        is_verified: p.verified,
        metadata: { source: "NACAC Final Report 2025" }
      }).eq('id', existing.id);
      console.log(`✅ Updated Person: ${p.name}`);
    } else {
      await supabase.from('people').insert({ 
        full_name: p.name, 
        role: p.role, 
        pep_tier: p.pep, 
        description: p.desc, 
        is_verified: p.verified, 
        metadata: { source: "NACAC Final Report 2025" } 
      });
      console.log(`✅ Inserted Person: ${p.name}`);
    }
  }

  // 3. Knowledge Base (Strategy & Gaps)
  const strategyEntries = [
    { 
      title: "NACAC OPI Proposal", 
      content: "The NACAC Final Report (Aug 2025) proposes the establishment of the Office of Public Integrity (OPI) as a Chapter 9 institution with binding recovery powers and a dedicated Whistleblower Protector.",
      metadata: { source: "NACAC Report 2025", pages: "160-193", type: "reform_strategy" }
    },
    { 
      title: "The 45% Reporting Threshold", 
      content: "HSRC data cited in the NACAC report indicates only 45% of South Africans are willing to report corruption, primarily due to fear of retaliation and lack of trust in SAPS.",
      metadata: { source: "NACAC Report 2025", pages: "627-632", type: "reporting_gap" }
    },
    { 
      title: "State Capture Economic Impact (R1.5 Trillion)", 
      content: "While Zondo estimated R57bn in tainted spending, broader economic audits cited by NACAC estimate total losses to GDP and public finances at R1.5 trillion.",
      metadata: { source: "NACAC Report 2025", pages: "713-715", type: "economic_impact" }
    }
  ];

  for (const entry of strategyEntries) {
    await supabase.from('ai_knowledge_base').insert({
      content: `${entry.title}: ${entry.content}`,
      metadata: entry.metadata
    });
    console.log(`🧠 Knowledge Ingested: ${entry.title}`);
  }

  console.log('🚀 Ingestion Completed.');
}

ingestNACAC2025();
