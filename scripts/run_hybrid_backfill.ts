import { ApifyClient } from 'apify-client';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { mapToStandardCategory } from './standardize_categories';

dotenv.config({ path: '.env.local' });

const apify = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runHybridBackfill() {
  console.log("Starting Historical Hybrid Crime Backfill Pipeline...");
  
  const RESEARCH_ACTOR_ID = 'orf7Pg6tToMqzz1sx';
  const BUILD_VERSION = '1.0.2';

  // --- CONFIGURATION ---
  // To go further back, we iterate through months or years
  const timeWindows = [
    { label: "Early 2026", query: "2026 January OR February OR March OR April OR May" },
    { label: "Late 2025", query: "2025 October OR November OR December" },
    { label: "Mid 2025", query: "2025 July OR August OR September" },
    { label: "Early 2025", query: "2025 January OR February OR March OR April OR May OR June" },
    { label: "2024 High Impact", query: "2024 ( \"gang war\" OR \"drug bust\" OR \"heist\" OR \"extortion\" OR \"kidnapped\" OR \"syndicate arrested\" )" },
    { label: "2023 Forensic", query: "2023 ( \"police corruption\" OR \"state capture\" OR \"tender fraud\" OR \"zama zama\" )" }
  ];

  for (const window of timeWindows) {
    try {
      console.log(`\n--- TARGETING: ${window.label} ---`);
      
      // 1. Broad Research with specific time window
      const broadInput = {
        query: `(site:news24.com OR site:iol.co.za) "South Africa" article ("arrested for" OR "killed in" OR "convicted of") ("gang hit" OR "drug bust" OR "cash-in-transit" OR "extortion" OR "kidnapped") ${window.query}`,
        maxResults: 15, // Increased from 8
        recursiveDepth: 1
      };

      const run = await apify.actor(RESEARCH_ACTOR_ID).call(broadInput, { waitSecs: 600, build: BUILD_VERSION });
      console.log(`[broad-research] Run ID: ${run.id}, Status: ${run.status}`);
      
      if (run.status !== 'SUCCEEDED') {
        console.error(`Broad research failed for ${window.label}. Skipping...`);
        continue;
      }

      const { items } = await apify.dataset(run.defaultDatasetId).listItems();
      console.log(`[broad-research] Retrieved ${items.length} items.`);

      // 2. Extraction & Triage
      const highValueTargets: any[] = [];

      for (const item of items) {
        const url = item.url || item.sourceUrl || item.source_url;
        let title = item.title || item.headline;
        
        // Filter out problematic index/search pages
        if (url && (url.includes('search.php') || url.includes('newsletter') || url.includes('instagram.com') || url.includes('twitter.com'))) {
          continue;
        }

        // Title extraction improvement
        if (!title || title === 'Untitled') {
          const content = item.markdown || item.text || '';
          const firstLine = content.split('\n').find(l => l.trim().length > 10)?.replace(/[#*`]/g, '').trim();
          if (firstLine && firstLine.length < 200) {
            title = firstLine;
          } else if (url) {
            try {
              const pathParts = new URL(url).pathname.split('/').filter(Boolean);
              title = pathParts[pathParts.length - 1]?.replace(/-/g, ' ') || 'Untitled';
            } catch { title = 'Untitled'; }
          }
        }

        if (!title || title === 'Untitled' || title.length < 10) continue;

        // Deduplication Check (Title or URL)
        const titleClean = title.replace(/['"]/g, "");
        const { data: existing } = await supabase
          .from('incidents')
          .select('id')
          .or(`title.ilike.%${titleClean}%,source_url.eq.${url}`)
          .maybeSingle();

        if (existing) {
          console.log(`- Skipping Duplicate: "${title}"`);
          continue;
        }

        const fullText = item.markdown || item.text || item.description || '';
        const mappedCategory = mapToStandardCategory(title, fullText);
        
        if (mappedCategory) {
          console.log(`- Categorized: "${title}" -> ${mappedCategory}`);
          
          const { error } = await supabase.from('incidents').insert({
            title: title.substring(0, 255),
            summary: (item.description || fullText.substring(0, 500)).substring(0, 1000),
            full_text: fullText || item.content,
            type: mappedCategory,
            category: mappedCategory,
            source_url: url,
            occurred_at: item.date || item.publishedDate || new Date().toISOString(),
            status: 'verified',
            metadata: { ...item, apify_run_id: run.id, backfill_window: window.label }
          });

          if (error) {
            console.error(`  Error inserting incident: ${error.message}`);
          } else {
            console.log(`  Successfully inserted into database.`);
            
            // Flag for deep research if high value
            if (mappedCategory === 'Corruption/Police Involvement' || mappedCategory === 'Gang Violence' || mappedCategory === 'Drug Trafficking' || mappedCategory === 'Extortion') {
              highValueTargets.push({ title: title, category: mappedCategory });
            }
          }
        }
      }

      // 3. Deep Research Escalation (Limited to 1 per window to save budget)
      if (highValueTargets.length > 0) {
        const target = highValueTargets[0];
        console.log(`\nEscalating top target for ${window.label}: ${target.title}`);
        
        const deepInput = {
          query: `Detailed forensic investigation: "${target.title}" South Africa crime syndicate and police involvement`,
          recursiveDepth: 2,
          maxResults: 3
        };

        try {
          const deepRun = await apify.actor(RESEARCH_ACTOR_ID).call(deepInput, { waitSecs: 900, build: BUILD_VERSION });
          if (deepRun.status === 'SUCCEEDED') {
            const { items: researchItems } = await apify.dataset(deepRun.defaultDatasetId).listItems();
            if (researchItems.length > 0) {
              await supabase.from('historical_records').insert({
                title: `Deep Research: ${target.title}`,
                content: JSON.stringify(researchItems),
                category: 'EVIDENCE_PACKAGE',
                tags: [target.category, 'historical-backfill'],
                metadata: { original_incident: target.title, apify_run_id: deepRun.id, backfill_window: window.label }
              });
              console.log(`  -> Deep research evidence saved.`);
            }
          }
        } catch (err: any) { console.error(`[deep-research] Error: ${err.message}`); }
      }

    } catch (err: any) {
      console.error(`Pipeline error in window ${window.label}: ${err.message}`);
    }
  }

  console.log("\nHistorical Hybrid Backfill Pipeline Completed.");
}

runHybridBackfill().catch(console.error);
