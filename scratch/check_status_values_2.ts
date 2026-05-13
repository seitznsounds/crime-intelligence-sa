import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function probe() {
    const statuses = ['active', 'former', 'inactive', 'under_investigation', 'arrested'];
    for (const s of statuses) {
      const { error: insertError } = await supabase
        .from('person_org_links')
        .insert({ person_id: '00000000-0000-0000-0000-000000000000', org_id: '00000000-0000-0000-0000-000000000000', status: s })
        .select();
      if (insertError && insertError.message.includes('check constraint')) {
        console.log(`❌ ${s} is NOT allowed`);
      } else {
        console.log(`✅ ${s} IS allowed`);
      }
    }
}

probe().catch(console.error);
