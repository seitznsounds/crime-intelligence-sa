import { createClient } from '@supabase/supabase-js';
import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const apify = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function auditBeneficialOwnership() {
  console.log("Starting Deep Beneficial Ownership Audit...");

  // 1. Identify key parties from court judgments (extract from title)
  const { data: judgments, error } = await supabase
    .from('historical_records')
    .select('id, title, metadata')
    .eq('category', 'COURT_JUDGMENT')
    .limit(100);

  if (error || !judgments) return;

  const targets = new Set<string>();
  judgments.forEach(j => {
    // Extract parties from title: "Party A v Party B (Case...)"
    const title = j.title.split(' (')[0];
    const parts = title.split(/ v /i);
    parts.forEach(p => {
        const name = p.trim().replace(/N\.O\.|and Another|and Others|Limited|Pty|Ltd/gi, '').trim();
        if (name && name.length > 3 && !['The State', 'S', 'SAPS', 'Minister'].some(s => name.includes(s))) {
            targets.add(name);
        }
    });
  });

  console.log(`Identified ${targets.size} potential audit targets.`);

  const DEEP_RESEARCH_ID = 'orf7Pg6tToMqzz1sx';
  const BUILD_VERSION = '1.0.2';

  // Sort by some heuristic or just take first few for prototype
  const sortedTargets = Array.from(targets).slice(0, 3);

  for (const name of sortedTargets) {
    console.log(`\nAuditing Beneficial Ownership for: ${name}`);
    
    const query = `Full beneficial ownership audit for "${name}" South Africa. Search CIPC director records, linked companies, and shell company networks. Find any links to organized crime or PEPs.`;
    
    try {
      const run = await apify.actor(DEEP_RESEARCH_ID).call({
        query: query,
        recursiveDepth: 2,
        maxResults: 5
      }, { waitSecs: 900, build: BUILD_VERSION });

      if (run.status === 'SUCCEEDED') {
        const { items } = await apify.dataset(run.defaultDatasetId).listItems();
        console.log(`  -> Audit complete. Found ${items.length} forensic nodes.`);
        
        await supabase.from('historical_records').insert({
          title: `Beneficial Ownership Audit: ${name}`,
          content: JSON.stringify(items),
          category: 'EVIDENCE_PACKAGE',
          tags: ['ownership-audit', 'cipc-search', name, 'phase-6'],
          metadata: { target_name: name, apify_run_id: run.id }
        });
        console.log(`  -> Audit evidence saved to vault.`);
      }
    } catch (err: any) {
      console.error(`  -> Audit failed for ${name}: ${err.message}`);
    }
  }

  console.log("\nBeneficial Ownership Audit Cycle Finished.");
}

auditBeneficialOwnership().catch(console.error);
