import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function analyzeLegalHeatmap() {
  console.log("Analyzing Legal Intelligence Distribution...");
  
  const { data: judgments, error } = await supabase
    .from('historical_records')
    .select('metadata')
    .eq('category', 'COURT_JUDGMENT');

  if (error || !judgments) return;

  const distribution: Record<string, number> = {};
  judgments.forEach(j => {
    const court = j.metadata?.['Court'] || 'Unknown';
    distribution[court] = (distribution[court] || 0) + 1;
  });

  console.log("\nJudgment Volume by Court String:");
  Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])
    .forEach(([court, count]) => {
      console.log(`- ${court}: ${count} judgments`);
    });
}

analyzeLegalHeatmap();
