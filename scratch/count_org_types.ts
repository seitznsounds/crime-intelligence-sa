import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function countOrgTypes() {
  const { data, error } = await supabase
    .from('organizations')
    .select('type');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const counts = data?.reduce((acc: any, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});
  console.log('Org types:', counts);
}

countOrgTypes();
