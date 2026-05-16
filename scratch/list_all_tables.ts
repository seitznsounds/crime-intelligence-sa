
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllTables() {
  // Try to use a known function or just query if possible
  const { data, error } = await supabase.from('organizations').select('id').limit(1);
  console.log('Orgs accessible:', !error);
  
  // Try to find org-org link table
  const possibleTables = ['org_links', 'organization_links', 'org_org_links', 'person_org_links'];
  for (const t of possibleTables) {
      const { data, error } = await supabase.from(t).select('*').limit(1);
      if (!error) {
          console.log(`Table ${t} exists and is accessible. Columns:`, data.length > 0 ? Object.keys(data[0]) : 'no data');
      } else {
          console.log(`Table ${t} check failed:`, error.message);
      }
  }
}

listAllTables();
