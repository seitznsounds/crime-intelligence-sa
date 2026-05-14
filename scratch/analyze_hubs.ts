import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function analyzeHubs() {
  // 1. Find organizations with highest link density
  const { data: orgs, error } = await supabase
    .from('organizations')
    .select('id, name, type, person_org_links(count)');

  if (error) {
    console.error('Error analyzing hubs:', error.message);
    return;
  }

  const hubs = orgs
    .map((o: any) => ({
      name: o.name,
      links: o.person_org_links[0].count,
      id: o.id
    }))
    .sort((a, b) => b.links - a.links)
    .slice(0, 5);

  console.log('Top Potential Hubs:', hubs);
}

analyzeHubs();
