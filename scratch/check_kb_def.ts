import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkKBDefinition() {
    // This is a hack to try to see function definitions if permissions allow
    const { data, error } = await supabase
        .from('pg_proc' as any)
        .select('prosrc')
        .eq('proname', 'search_knowledge_base');
    
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Definition:', data);
    }
}

checkKBDefinition();
