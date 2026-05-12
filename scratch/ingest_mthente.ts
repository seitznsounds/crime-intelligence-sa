
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestMthente() {
  console.log('🚀 Starting Ingestion: Mthente Literature Review...');

  // 1. Knowledge Base - Zondo Reform Pillars
  const zondoPillars = [
    { 
      title: "Zondo Reform Pillar 1: Whistleblower Rewards", 
      content: "Recommendation to allow whistleblowers to financially benefit from disclosures (similar to the US False Claims Act). Current Status: Proposed.",
      metadata: { source: "Mthente Lit Review / Zondo", pillar: 2, category: "whistleblower_protection" }
    },
    { 
      title: "Zondo Reform Pillar 2: Procurement Agency", 
      content: "Creation of a dedicated anti-corruption agency focusing specifically on public procurement irregularities. Current Status: Proposed (merged into OPI concept).",
      metadata: { source: "Mthente Lit Review / Zondo", pillar: 3, category: "institutional_reform" }
    },
    { 
      title: "Noble Cause Corruption Fallacy", 
      content: "Definition: The misuse of public power justified as being in the 'public interest' or for a 'noble cause'. Often used to bypass procurement rules during emergencies.",
      metadata: { source: "Mthente Lit Review / Prof. Christopher Stone", category: "corruption_typology" }
    },
    { 
      title: "Accounting Officer Statutory Duty (PFMA)", 
      content: "The PFMA (Act 1 of 1999) designates the Accounting Officer (usually the DG) as the individual responsible for the procurement system. They are legally liable for irregular, fruitless, or wasteful expenditure.",
      metadata: { source: "Mthente Lit Review", category: "legal_liability", act: "PFMA" }
    }
  ];

  for (const pillar of zondoPillars) {
    await supabase.from('ai_knowledge_base').insert({
      content: `${pillar.title}: ${pillar.content}`,
      metadata: pillar.metadata
    });
  }

  // 2. People (Researchers)
  const researchers = [
    { name: "Narnia Bohler-Muller", role: "Executive Director, HSRC", pep: 2, desc: "Expert in constitutional law and tracking Zondo Commission implementation." },
    { name: "Christopher E. Stone", role: "Professor (Public Corruption Turnarounds)", pep: 2, desc: "Global expert on police corruption and institutional integrity." }
  ];

  for (const r of researchers) {
    const { data: existing } = await supabase.from('people').select('id').eq('full_name', r.name).maybeSingle();
    if (existing) {
      await supabase.from('people').update({
        role: r.role, pep_tier: r.pep, description: r.desc, metadata: { source: "Mthente Literature Review" }
      }).eq('id', existing.id);
    } else {
      await supabase.from('people').insert({ 
        full_name: r.name, role: r.role, pep_tier: r.pep, description: r.desc, metadata: { source: "Mthente Literature Review" } 
      });
    }
  }

  console.log('🚀 Ingestion Completed.');
}

ingestMthente();
