import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  const { data, error } = await supabase.rpc('get_table_info', { table_name: 'person_org_links' });
  if (error) {
    // If RPC doesn't exist, try a simple select and check metadata or just try common values
    console.log("RPC get_table_info not found, trying manual probe.");
    const statuses = ['active', 'former', 'suspended', 'implicated', 'investigated'];
    for (const s of statuses) {
      const { error: insertError } = await supabase
        .from('person_org_links')
        .insert({ person_id: '00000000-0000-0000-0000-000000000000', org_id: '00000000-0000-0000-0000-000000000000', status: s })
        .select();
      if (insertError && insertError.message.includes('check constraint')) {
        console.log(`❌ ${s} is NOT allowed`);
      } else {
        console.log(`✅ ${s} IS allowed (or failed for other reasons)`);
      }
    }
  } else {
    console.log(data);
  }
}

checkSchema().catch(console.error);
