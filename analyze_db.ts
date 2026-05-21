import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function analyze() {
  console.log("Analyzing Syndicates...");
  
  const { data: syndicates, error } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('type', 'syndicate')
    .order('name');
    
  if (error) throw error;
  
  console.log(`Total Syndicates remaining: ${syndicates.length}`);
  
  // Print all of them to analyze patterns
  syndicates.forEach(s => console.log(`- [${s.id}] ${s.name}`));
}

analyze().catch(console.error);
