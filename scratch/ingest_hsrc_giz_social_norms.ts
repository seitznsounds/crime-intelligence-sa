
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestHSRCSocialNorms() {
  console.log('🚀 Starting Ingestion: HSRC-GIZ Social Norms Report (2025)...');

  // 1. People
  const authors = [
    { name: "Steven Gordon", role: "HSRC Lead Researcher", pep: 2, desc: "Lead author of the Tracking Social Norms study." },
    { name: "Gary Pienaar", role: "HSRC Advocate/Researcher", pep: 2, desc: "Co-author of the Tracking Social Norms study." },
    { name: "Narnia Bohler-Muller", role: "HSRC Executive", pep: 2, desc: "Executive oversight for the HSRC DCES division." }
  ];

  for (const p of authors) {
    const { data: existing } = await supabase.from('people').select('id').eq('full_name', p.name).maybeSingle();
    if (existing) {
      await supabase.from('people').update({
        role: p.role, pep_tier: p.pep, description: p.desc, metadata: { source: "HSRC Social Norms 2025" }
      }).eq('id', existing.id);
    } else {
      await supabase.from('people').insert({ 
        full_name: p.name, role: p.role, pep_tier: p.pep, description: p.desc, metadata: { source: "HSRC Social Norms 2025" } 
      });
    }
  }

  // 2. Knowledge Base (Statistical Benchmarks & Findings)
  const knowledge = [
    { 
      title: "Social Mobility Driver: Political Connections (2025)", 
      content: "61% of South Africans believe political connections are essential or very important for getting ahead in life, significantly higher than bribery (42%).",
      metadata: { source: "HSRC Social Norms 2025", type: "social_mobility", finding_id: "NORM-2025-001" }
    },
    { 
      title: "The Testimony Gap: Fear of Court Precints", 
      content: "A 11% delta exists between willingness to report corruption (59%) and willingness to testify in court (48%), driven by a culture of fear and physical impunity.",
      metadata: { source: "HSRC Social Norms 2025", type: "justice_gap", finding_id: "NORM-2025-002" }
    },
    { 
      title: "Occupational Corruption Hotbeds", 
      content: "19% of adults admit their occupation is a 'hotbed' of corruption where bribery and rule-bending are normalized professional duty.",
      metadata: { source: "HSRC Social Norms 2025", type: "professional_ethics", finding_id: "NORM-2025-003" }
    },
    { 
      title: "Sextortion Parallelism (Public vs Private)", 
      content: "Indirect experience of sexual extortion is nearly identical in the public sector (11%) and private sector (10%), indicating systemic cross-sectoral patriarchy.",
      metadata: { source: "HSRC Social Norms 2025", type: "gendered_corruption", finding_id: "NORM-2025-004" }
    }
  ];

  for (const entry of knowledge) {
    await supabase.from('ai_knowledge_base').insert({
      content: `${entry.title}: ${entry.content}`,
      metadata: entry.metadata
    });
  }

  // 3. Update Historical Records
  await supabase.from('historical_records').insert({
    title: "Tracking Social Norms and Behaviour Change Report 2025 (HSRC-GIZ)",
    content: "A nationally representative survey of 3,095 adults tracking attitudes toward corruption. Key findings highlight the premium on political connections and the significant gap in willingness to testify in court.",
    event_date: "2025-07-01",
    category: "Social Norms Research",
    metadata: { source: "HSRC Social Norms 2025 Headline Report" }
  });

  console.log('🚀 Ingestion Completed.');
}

ingestHSRCSocialNorms();
