import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findMissingIntel() {
  const { data: people, error } = await supabase.from('people').select('id, full_name');
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
      missing.push(person.full_name);
    }
  }

  console.log("Missing Intel for:");
  console.log(missing.join('\n'));
}

findMissingIntel();
