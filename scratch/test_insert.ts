import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testInsert() {
  const { data, error } = await supabase
    .from('historical_records')
    .insert([
      {
        title: "Test Evidence Package",
        summary: "Testing the evidence packaging system.",
        content: "Detailed intelligence data for tribunal.",
        category: "EVIDENCE_PACKAGE",
        metadata: {
            recipient: "ICC",
            classification: "SECRET",
            timestamp: new Date().toISOString()
        }
      }
    ])
    .select();

  if (error) {
    console.error('Error inserting:', error.message);
  } else {
    console.log('Insert successful:', data[0].id);
    
    // Clean up
    await supabase.from('historical_records').delete().eq('id', data[0].id);
  }
}

testInsert();
