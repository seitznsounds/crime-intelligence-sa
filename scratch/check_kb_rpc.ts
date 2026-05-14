import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkKB() {
  const { data, error } = await supabase.rpc('search_knowledge_base', {
    query_embedding: new Array(384).fill(0),
    match_threshold: 0.5,
    match_count: 1
  });

  if (error) {
    console.log('search_knowledge_base error:', error.message);
  } else {
    console.log('search_knowledge_base results:', data?.length);
  }
}

checkKB();
