import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data, error } = await supabase.from('person_relationships').select('relationship_type').limit(10);
    if (error) {
        console.error("Error fetching relationships:", error.message);
    } else {
        console.log("Existing relationship types:", data.map(r => r.relationship_type));
    }
}

main();
