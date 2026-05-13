import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkCategories() {
  const { data, error } = await supabase
    .from('historical_records')
    .select('category')
    .not('category', 'is', null);

  if (error) {
    console.error(error);
    return;
  }

  const categories = [...new Set(data.map(d => d.category))];
  console.log("Categories found in historical_records:", categories);
}

checkCategories();
