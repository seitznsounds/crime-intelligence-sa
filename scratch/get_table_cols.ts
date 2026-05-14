import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getCols() {
  const tables = ['people', 'organizations'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (!error && data && data.length > 0) {
        console.log(`Columns for ${table}:`, Object.keys(data[0]));
        // Check for embedding column
        if (Object.keys(data[0]).includes('embedding')) {
            console.log(`${table} has embedding column!`);
        }
    } else {
        console.log(`Error or no data for ${table}:`, error?.message);
    }
  }
}

getCols();
