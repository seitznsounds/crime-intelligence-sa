import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const names = [
        "Vusimuzi Matlala", "Simon Rudland", "Kamlesh Pattni", "Ralph Stanfield",
        "Anthony Gounden", "Sadia Madatt", "Horatio Solomon", "Rashied Staggie",
        "Igsaan Davids", "Mark Lifman"
    ];
    
    console.log("Fetching IDs for Priority Targets...");
    const { data: people, error } = await supabase
        .from('people')
        .select('id, full_name')
        .or(names.map(n => `full_name.ilike.%${n}%`).join(','));

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log(JSON.stringify(people, null, 2));
    }
}

main();
