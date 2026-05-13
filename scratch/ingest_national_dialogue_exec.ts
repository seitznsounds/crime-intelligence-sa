
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestNationalDialogueExec() {
  console.log('🚀 Starting Ingestion: National Dialogue 2024 (Executive Summary)...');

  // 1. Organizations
  const organizations = [
    { name: "Office of Public Integrity (OPI)", type: "government", status: "proposed", description: "Proposed Chapter 9 institution with constitutional protections; civil investigations; binding recommendations. Aims to operate within a year leveraging SIU resources." },
    { name: "National Anti-Corruption Advisory Council (NACAC)", type: "government", status: "active", description: "Multi-sectoral advisory body appointed by the President in August 2022 to oversee NACS implementation." }
  ];

  for (const org of organizations) {
    await supabase.from('organizations').upsert({ 
      name: org.name, type: org.type, status: org.status, description: org.description, metadata: { source: "National Dialogue 2024 Exec Summary" } 
    }, { onConflict: 'name' });
  }

  // 2. People
  const people = [
    { name: "F. Cachalia", role: "Chairperson, NACAC", pep: 2, desc: "Lead advisor on anti-corruption architecture. Described the dialogue as a potential 'Codesa moment'." },
    { name: "Nkosikazi N. Mhlauli", role: "Deputy Chairperson, NACAC", pep: 2, desc: "Advocate for youth as change agents in the fight against corruption." }
  ];

  for (const p of people) {
    const { data: existing } = await supabase.from('people').select('id').eq('full_name', p.name).maybeSingle();
    if (existing) {
      await supabase.from('people').update({
        role: p.role, pep_tier: p.pep, description: p.desc, metadata: { source: "National Dialogue 2024 Exec Summary" }
      }).eq('id', existing.id);
    } else {
      await supabase.from('people').insert({ 
        full_name: p.name, role: p.role, pep_tier: p.pep, description: p.desc, metadata: { source: "National Dialogue 2024 Exec Summary" } 
      });
    }
  }

  // 3. Knowledge Base / Historical Records (Strategic Pillars & Findings)
  const knowledge = [
    { 
      title: "OPI Establishment (NACS Pillar 1)", 
      content: "Participants strongly endorsed the expedited establishment of the OPI as a Chapter 9 institution with constitutional protections. Leveraging SIU resources, the OPI aims to operate within a year.",
      metadata: { source: "National Dialogue 2024 Exec Summary", type: "institutional_reform", finding_id: "NACS-2024-001" }
    },
    { 
      title: "Public Procurement Transformation (NACS Pillar 3)", 
      content: "National Treasury's commitment to implementing an e-procurement system, with transparency, community oversight, and blacklisting of corrupt suppliers.",
      metadata: { source: "National Dialogue 2024 Exec Summary", type: "procurement_reform", finding_id: "NACS-2024-002" }
    },
    { 
      title: "Whistleblower Protection Reform (NACS Pillar 2)", 
      content: "Called for urgent legislative reforms to expand the scope of the Protected Disclosures Act and criminalize retaliation.",
      metadata: { source: "National Dialogue 2024 Exec Summary", type: "whistleblower_reform", finding_id: "NACS-2024-003" }
    }
  ];

  for (const entry of knowledge) {
    await supabase.from('ai_knowledge_base').insert({
      content: `${entry.title}: ${entry.content}`,
      metadata: entry.metadata
    });
  }

  // 4. Update Historical Records
  await supabase.from('historical_records').insert({
    title: "National Stakeholder Dialogue on Anti-Corruption 2024",
    content: "The Presidency, NACAC, and PSC held the second National Dialogue on 9-10 December 2024. Key outcome: Endorsement of the Office of Public Integrity (OPI) and e-procurement systems.",
    event_date: "2024-12-09",
    category: "Anti-Corruption Strategy",
    metadata: { source: "National Dialogue 2024 Exec Summary" }
  });

  console.log('🚀 Ingestion Completed.');
}

ingestNationalDialogueExec();
