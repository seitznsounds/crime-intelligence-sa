import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data, error } = await supabase.from('people').select('status').limit(20);
    if (error) {
        console.error("Error fetching people:", error.message);
    } else {
        console.log("Existing people statuses:", [...new Set(data.map(p => p.status))]);
    }
}

main();
