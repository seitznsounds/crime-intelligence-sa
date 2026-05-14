import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDataAvailability() {
  const tables = [
    'people',
    'incidents',
    'organizations',
    'historical_records',
    'trc_volumes',
    'station_statistics',
    'humanity_crimes_perpetrators',
    'ai_news',
    'ai_knowledge_base'
  ];

  console.log('📊 Supabase Data Audit:\n');

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`❌ Error checking ${table}:`, error.message);
    } else {
      console.log(`- ${table.padEnd(30)}: ${count} rows`);
    }
  }

  // Check categories in historical_records
  console.log('\n🔍 Historical Record Categories:');
  const { data: categories } = await supabase
    .from('historical_records')
    .select('category');
  
  const counts = categories?.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});
  console.log(counts);
}

checkDataAvailability();
