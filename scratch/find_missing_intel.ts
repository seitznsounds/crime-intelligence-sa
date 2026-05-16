import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findMissingIntel() {
  const { data: people, error } = await supabase
    .from('people')
    .select('id, full_name, risk_score, pep_tier')
    .or('risk_score.gt.80,pep_tier.in.(1,2)');

  if (error || !people) {
    console.error(error);
    return;
  }

  const filePath = path.join(process.cwd(), 'intelligence', 'corruption_knowledge_graph.json');
  let graph = { nodes: [] };
  if (fs.existsSync(filePath)) {
    graph = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  const missing = [];
  for (const person of people) {
    const node = graph.nodes.find((n: any) => 
      n.name.toLowerCase().includes(person.full_name.toLowerCase()) || 
      person.full_name.toLowerCase().includes(n.name.toLowerCase())
    );
    if (!node) {
      missing.push({ name: person.full_name, risk: person.risk_score, tier: person.pep_tier });
    }
  }

  console.log(`Found ${missing.length} missing high-priority targets.`);
  console.log("Missing Intel for:");
  missing.forEach(m => console.log(`- ${m.name} (Risk: ${m.risk || 'N/A'}, Tier: ${m.tier || 'N/A'})`));
  
  // Save the list for the automated triage
  fs.writeFileSync(path.join(process.cwd(), 'scratch', 'priority_missing_intel.json'), JSON.stringify(missing, null, 2));
}

findMissingIntel();
