
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestHSRC2025() {
  console.log('🚀 Starting Ingestion: HSRC-GIZ Social Norms Report 2025...');

  // 1. Knowledge Base - Core Metrics
  const metrics = [
    { 
      title: "The Reporting Void (2025)", 
      content: "HSRC 2025 finding: Only 46% of South Africans are willing to report corruption, despite 61% recognizing its large negative impact. This 15% 'Reporting Void' represents the primary target for anti-corruption interventions.",
      metadata: { source: "HSRC-GIZ Social Norms 2025", metric: "reporting_willingness", value: 0.46 }
    },
    { 
      title: "Fear of Retaliation Index", 
      content: "62% of South African adults believe that speaking out against corruption in their communities risks revenge (job loss, social ostracism, or violence). Highest fear levels found in rural farm areas, KZN, and Free State.",
      metadata: { source: "HSRC-GIZ Social Norms 2025", metric: "fear_rate", value: 0.62 }
    },
    { 
      title: "Radius of Codes of Silence (RoCoSN)", 
      content: "34% of the population adheres to strong Codes of Silence, viewing reporting as a moral betrayal of their social network. This index is strongest in Western Cape, KZN, and North West.",
      metadata: { source: "HSRC-GIZ Social Norms 2025", metric: "codes_of_silence", value: 0.34 }
    },
    { 
      title: "Public Sector Sextortion Exposure", 
      content: "41% of South Africans reported indirect experiences of sextortion (sexual favors demanded for services) by public officials in 2025.",
      metadata: { source: "HSRC-GIZ Social Norms 2025", category: "sextortion", value: 0.41 }
    }
  ];

  for (const metric of metrics) {
    await supabase.from('ai_knowledge_base').insert({
      content: `${metric.title}: ${metric.content}`,
      metadata: metric.metadata
    });
  }

  // 2. People (Lead Researchers)
  const researchers = [
    { name: "Steven Gordon", role: "HSRC Lead Researcher (DCES)", pep: 2, desc: "Lead author of the 2025 Social Norms study." },
    { name: "Gary Pienaar", role: "Advocate & HSRC Senior Researcher", pep: 2, desc: "Expert in legal frameworks and anti-corruption social values." }
  ];

  for (const r of researchers) {
    const { data: existing } = await supabase.from('people').select('id').eq('full_name', r.name).maybeSingle();
    if (existing) {
      await supabase.from('people').update({
        role: r.role, pep_tier: r.pep, description: r.desc, metadata: { source: "HSRC-GIZ Social Norms 2025" }
      }).eq('id', existing.id);
    } else {
      await supabase.from('people').insert({ 
        full_name: r.name, role: r.role, pep_tier: r.pep, description: r.desc, metadata: { source: "HSRC-GIZ Social Norms 2025" } 
      });
    }
  }

  console.log('🚀 Ingestion Completed.');
}

ingestHSRC2025();
