import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectAudits() {
  const ids = [
    '133ffa32-70c7-4f0a-bfd9-2750b2953def',
    'bce37fa0-84e4-4eb9-beca-f8b16a881380',
    'b12a5d76-92d0-44cc-99b8-17ff9a8b68df',
    '679d80f1-6b8f-443a-a200-3d962b4a130c'
  ];

  const { data, error } = await supabase
    .from('historical_records')
    .select('*')
    .in('id', ids);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(JSON.stringify(data, null, 2));
}

inspectAudits();
