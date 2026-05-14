import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function searchPeople() {
  const names = ["Babita Deokaran", "Cloete Murray", "Matthew Goniwe", "Ahmed Timol"];
  
  for (const name of names) {
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .ilike('full_name', `%${name}%`);

    if (error) {
      console.error(`Error searching for ${name}:`, error);
      continue;
    }

    console.log(`Results for ${name}:`, data?.length);
    if (data && data.length > 0) {
      console.log(JSON.stringify(data[0], null, 2));
    }
  }
}

searchPeople();
