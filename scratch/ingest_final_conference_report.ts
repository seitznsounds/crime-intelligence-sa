
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestFinalConferenceReport() {
  console.log('🚀 Starting Ingestion: Final Conference Report (National Dialogue 2025)...');

  // 1. Organizations
  const organizations = [
    { name: "SIU Tribunal", type: "judicial", status: "active", description: "Specialized tribunal for faster finalization of corruption and asset recovery cases." },
    { name: "Whistleblower House", type: "ngo", status: "active", description: "NGO providing support and protection for whistleblowers; collaborates with SIU." },
    { name: "Gauteng Ethics Advisory Council (GEAC)", type: "government", status: "active", description: "Provincial advisory body focused on ethics and whistleblower coaching." },
    { name: "Criminal Assets Recovery Account (CARA)", type: "government", status: "active", description: "Legislated account for funds recovered from criminal activities; proposed as a whistleblower support source." }
  ];

  for (const org of organizations) {
    await supabase.from('organizations').upsert({ 
      name: org.name, type: org.type, status: org.status, description: org.description, metadata: { source: "Final Conference Report 2025" } 
    }, { onConflict: 'name' });
  }

  // 2. People (New or Updated)
  const people = [
    { name: "Raymond Zondo", role: "Former Chief Justice", pep: 1, desc: "State Capture Commission head; advocate for whistleblower rewards (10% benchmark)." },
    { name: "William Bourdon", role: "Chair and Founder, PPLAAF", pep: 2, desc: "International whistleblower expert and legal advocate." },
    { name: "Kholeka Gcaleka", role: "Public Protector of South Africa", pep: 1, desc: "Investigating PDA reforms; emphasizes following the money to private enablers." },
    { name: "Andy Mothibi", role: "Head of SIU", pep: 1, desc: "Advocate for consolidated whistleblower laws and SIU-Tribunal efficiency." },
    { name: "Henri Thulliez", role: "Executive Director, PPLAAF", pep: 2, desc: "Expert on African whistleblower protection mechanisms." },
    { name: "Cynthia Stimpel", role: "SAA Whistleblower", pep: 3, desc: "Corruption blocker who saved SAA R256m by refusing irregular payments." },
    { name: "Biswick Kaswasa", role: "Whistleblower", pep: 3, desc: "Experienced severe international retaliation; advocate for cross-border protection." },
    { name: "Roshnee Narrandes", role: "Southern Africa Regional Director, PPLAAF", pep: 2, desc: "Leads whistleblower support and legislative advocacy in Southern Africa." }
  ];

  for (const p of people) {
    const { data: existing } = await supabase.from('people').select('id').eq('full_name', p.name).maybeSingle();
    if (existing) {
      await supabase.from('people').update({
        role: p.role, pep_tier: p.pep, description: p.desc, metadata: { source: "Final Conference Report 2025" }
      }).eq('id', existing.id);
    } else {
      await supabase.from('people').insert({ 
        full_name: p.name, role: p.role, pep_tier: p.pep, description: p.desc, metadata: { source: "Final Conference Report 2025" } 
      });
    }
  }

  // 3. Knowledge Base / Historical Records (Strategic Pillars & Findings)
  const knowledge = [
    { 
      title: "Incentive Benchmarking (10% Recovery)", 
      content: "Raymond Zondo and PPLAAF recommend awarding 10% of recovered assets to whistleblowers to offset the high personal and financial risk of 'corruption resistors'.",
      metadata: { source: "Final Conference Report 2025", type: "incentive_reform", finding_id: "WB-2025-001" }
    },
    { 
      title: "Reverse Burden of Proof (Labour Law)", 
      content: "Proposal to shift the burden of proof to the employer in PDA retaliation cases, requiring the employer to prove that detrimental action was NOT linked to the disclosure.",
      metadata: { source: "Final Conference Report 2025", type: "legal_reform", finding_id: "WB-2025-002" }
    },
    { 
      title: "Recognition of Sextortion", 
      content: "Formal recognition of 'sex for marks' and 'sex for jobs' as unique corruption risks requiring gender-sensitive anti-corruption policies.",
      metadata: { source: "Final Conference Report 2025", type: "gender_corruption", finding_id: "WB-2025-003" }
    },
    { 
      title: "The 'Impipi' Stigma Removal", 
      content: "Behavioral change campaign aimed at destigmatizing the term 'impipi' and glorifying whistleblowers as 'Ubuntu' heroes through mass communication.",
      metadata: { source: "Final Conference Report 2025", type: "social_norms", finding_id: "WB-2025-004" }
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
    title: "Strengthening Whistleblower Protection Mechanisms Conference 2025",
    content: "NACAC and PPLAAF joint conference in Cape Town. Key outcomes: Proposed Citizens' Bill, independent authority under retired judge, and 10% reward benchmark.",
    event_date: "2025-03-05",
    category: "Anti-Corruption Strategy",
    metadata: { source: "Final Conference Report 2025" }
  });

  console.log('🚀 Ingestion Completed.');
}

ingestFinalConferenceReport();
