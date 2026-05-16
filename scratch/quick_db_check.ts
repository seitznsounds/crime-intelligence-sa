import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runQuery() {
    console.log(`--- DB Stats ---`);
    
    const { count: peopleCount } = await supabase.from('people').select('*', { count: 'exact', head: true });
    const { count: orgCount } = await supabase.from('organizations').select('*', { count: 'exact', head: true });
    const { count: linkCount } = await supabase.from('person_org_links').select('*', { count: 'exact', head: true });
    const { count: relCount } = await supabase.from('person_relationships').select('*', { count: 'exact', head: true });
    const { count: incidentCount } = await supabase.from('incidents').select('*', { count: 'exact', head: true });

    console.log(`People: ${peopleCount}`);
    console.log(`Organizations: ${orgCount}`);
    console.log(`Person-Org Links: ${linkCount}`);
    console.log(`Person-Person Relationships: ${relCount}`);
    console.log(`Incidents: ${incidentCount}`);
}

runQuery();
