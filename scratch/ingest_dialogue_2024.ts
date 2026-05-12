
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestNationalDialogue2024() {
  console.log('🚀 Starting Ingestion: National Dialogue on Anti-Corruption 2024...');

  // 1. Organizations
  const organizations = [
    { name: "African Women Against Corruption Network (AWACN)", type: "ngo", status: "active", description: "NGO focused on the gendered impact of corruption and sextortion." },
    { name: "Asivikelane", type: "ngo", status: "active", description: "Community-led monitoring project for municipal service delivery and procurement." },
    { name: "National School of Government (NSG)", type: "academic", status: "active", description: "Institution responsible for the professionalisation and ethics training of public servants." }
  ];

  for (const org of organizations) {
    await supabase.from('organizations').upsert({ 
      name: org.name, type: org.type, status: org.status, description: org.description, metadata: { source: "National Dialogue Report 2024" } 
    }, { onConflict: 'name' });
  }

  // 2. People (Dialogue Leadership)
  const people = [
    { name: "Mzamo Buthelezi", role: "Minister for the Public Service and Administration", pep: 1, desc: "Key proponent of public sector professionalisation and merit-based recruitment." },
    { name: "Phindile Baleni", role: "Director-General in the Presidency", pep: 1, desc: "Secretary of the Cabinet and champion of the NACS implementation." },
    { name: "Somadoda Fikeni", role: "Chairperson, Public Service Commission", pep: 2, desc: "Advocate for ethical leadership and personal accountability in the civil service." }
  ];

  for (const p of people) {
    const { data: existing } = await supabase.from('people').select('id').eq('full_name', p.name).maybeSingle();
    if (existing) {
      await supabase.from('people').update({
        role: p.role, pep_tier: p.pep, description: p.desc, metadata: { source: "National Dialogue Report 2024" }
      }).eq('id', existing.id);
    } else {
      await supabase.from('people').insert({ 
        full_name: p.name, role: p.role, pep_tier: p.pep, description: p.desc, metadata: { source: "National Dialogue Report 2024" } 
      });
    }
  }

  // 3. Knowledge Base (Specific Reforms)
  const knowledge = [
    { 
      title: "Reverse Onus Recommendation", 
      content: "The 2024 National Dialogue recommended legislative amendments to the PDA to include 'Reverse Onus' in retaliation cases, shifting the burden of proof to the employer.",
      metadata: { source: "National Dialogue Report 2024", section: "Session 3: Pillar 1", type: "legal_reform" }
    },
    { 
      title: "Whistleblower Support Fund", 
      content: "Call for the establishment of a dedicated fund to provide financial, psychological, and legal assistance to whistleblowers to prevent isolation and ruin.",
      metadata: { source: "National Dialogue Report 2024", section: "Session 3: Pillar 1", type: "support_mechanism" }
    },
    { 
      title: "Sextortion Recognition", 
      content: "Formal recognition of 'sextortion' as a unique and pervasive corruption risk for women in South Africa, requiring gender-sensitive reporting mechanisms.",
      metadata: { source: "National Dialogue Report 2024", section: "Session 3: Pillar 1", type: "gender_corruption" }
    }
  ];

  for (const entry of knowledge) {
    await supabase.from('ai_knowledge_base').insert({
      content: `${entry.title}: ${entry.content}`,
      metadata: entry.metadata
    });
  }

  console.log('🚀 Ingestion Completed.');
}

ingestNationalDialogue2024();
