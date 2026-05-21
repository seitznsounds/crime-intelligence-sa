import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  console.log("Checking relations...");
  // Try to fetch one syndicate with deep links to see what foreign keys exist
  // We'll test:
  // - person_org_links
  // - incident_org_links (if exists)
  // - organization_relationships (if exists)
  
  const { data, error } = await supabase
    .from('organizations')
    .select(`
      id, name,
      person_org_links (
        role_in_org,
        people ( full_name )
      )
    `)
    .eq('type', 'syndicate')
    .limit(1);
    
  console.log("Org Links:", data, error?.message);

  // Check if incident_org_links exists
  const { data: iol, error: errIol } = await supabase.from('incident_org_links').select('*').limit(1);
  console.log("Incident Org Links Exists:", !errIol);

  // Check incidents table to see how court cases are flagged
  const { data: inc, error: errInc } = await supabase.from('incidents').select('id, title, type').limit(5);
  console.log("Incidents sample:", inc);
}

check().catch(console.error);
