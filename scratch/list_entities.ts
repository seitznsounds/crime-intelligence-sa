import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data: people } = await supabase.from('people').select('full_name').limit(10);
    console.log("Top 10 People in DB:", people?.map(p => p.full_name));

    const { data: orgs } = await supabase.from('organizations').select('name').limit(10);
    console.log("Top 10 Orgs in DB:", orgs?.map(o => o.name));
}

main();
