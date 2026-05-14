import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedWPU() {
  const { data, error } = await supabase
    .from('organizations')
    .insert([
      {
        name: "Witness Protection Unit (WPU)",
        type: "law_enforcement",
        sector: "Security / Justice",
        status: "under_investigation",
        risk_score: 8.5,
        description: "Operates under a 'Dual Home' arrangement between DOJCD and NPA, leading to funding gaps and leadership instability.",
        metadata: {
          vacancy_rate: "40%",
          funding_deficit: "R120m",
          protection_paradox: "Section 7 requires reporting to potentially implicated SAPS structures.",
          zondo_alignment: "12% progress on reforms"
        }
      }
    ])
    .select();

  if (error) {
    console.error('Error seeding WPU:', error);
    return;
  }

  console.log('Seeded WPU:', data);
}

seedWPU();
