import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const names = ['Vusimuzi Matlala', 'Simon Rudland', 'Kamlesh Pattni', 'Falcon Cat Trading'];
    
    console.log("Checking for specific entities...");
    for (const name of names) {
        const { data: p } = await supabase.from('people').select('id').ilike('full_name', `%${name}%`).maybeSingle();
        const { data: o } = await supabase.from('organizations').select('id').ilike('name', `%${name}%`).maybeSingle();
        console.log(`[${name}] People: ${p ? 'FOUND' : 'MISSING'}, Orgs: ${o ? 'FOUND' : 'MISSING'}`);
    }
}

main();
