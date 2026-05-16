
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const tables = ['organizations', 'people', 'person_org_links'];
  for (const table of tables) {
    console.log(`--- Schema for ${table} ---`);
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: table });
    if (error) {
      // If RPC fails, try a select limit 0 to see headers if possible
      const { data: cols, error: selectError } = await supabase.from(table).select('*').limit(0);
      if (selectError) {
        console.error(`Error checking ${table}:`, selectError.message);
      } else {
        console.log(`Columns for ${table}:`, Object.keys(cols?.[0] || {}));
      }
    } else {
      console.log(data);
    }
  }
}

checkSchema();
