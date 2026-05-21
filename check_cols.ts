import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function cols() {
  const { data: pol } = await supabase.from('person_org_links').select('*').limit(1);
  console.log("person_org_links cols:", pol ? Object.keys(pol[0]) : "none");

  const { data: p } = await supabase.from('people').select('*').limit(1);
  console.log("people cols:", p ? Object.keys(p[0]) : "none");

  const { data: pil } = await supabase.from('person_incident_links').select('*').limit(1);
  console.log("person_incident_links cols:", pil ? Object.keys(pil[0]) : "none");
}

cols().catch(console.error);
