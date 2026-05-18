import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function analyzeLegalClusters() {
  console.log("Analyzing Legal Representation Clusters...");

  const { data: judgments, error } = await supabase
    .from('historical_records')
    .select('id, title, metadata')
    .eq('category', 'COURT_JUDGMENT')
    .limit(1000);

  if (error || !judgments) return;

  const attorneyMap: Record<string, string[]> = {};

  judgments.forEach(j => {
    const meta = j.metadata || {};
    // Key might vary: "Legal Representation", "Attorneys", etc.
    // Based on Sabinet extraction, we might have nested tags
    const attorneys = meta['Legal Representation'] || meta['Legal Rep'] || [];
    const parties = j.title.split(' (')[0];

    if (attorneys && Array.isArray(attorneys)) {
        attorneys.forEach((a: string) => {
            if (!attorneyMap[a]) attorneyMap[a] = [];
            attorneyMap[a].push(parties);
        });
    }
  });

  console.log("\nDetected Clusters (Attorneys representing multiple parties):");
  const clusters = Object.entries(attorneyMap)
    .filter(([name, cases]) => cases.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  clusters.forEach(([name, cases]) => {
    console.log(`\nAttorney: ${name} (${cases.length} cases)`);
    [...new Set(cases)].forEach(c => console.log(`  - ${c}`));
  });

  console.log(`\nAnalysis Finished. Found ${clusters.length} active legal clusters.`);
}

analyzeLegalClusters().catch(console.error);
