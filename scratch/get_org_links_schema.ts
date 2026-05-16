
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getOrgLinksSchema() {
  const { data, error } = await supabase.rpc('get_table_info', { table_name: 'org_links' });
  if (error) {
      console.log('RPC get_table_info failed:', error.message);
      // Try get_table_columns
      const { data: data2, error: error2 } = await supabase.rpc('get_table_columns', { table_name: 'org_links' });
      if (error2) {
          console.log('RPC get_table_columns failed:', error2.message);
      } else {
          console.log('Columns from get_table_columns:', data2);
      }
  } else {
      console.log('Table info from get_table_info:', data);
  }
}

getOrgLinksSchema();
