import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function resolveLifecycle() {
  console.log("Resolving Case Lifecycles (News -> Judgment)...");
  
  const { data: news } = await supabase.from('incidents').select('id, title, metadata');
  const { data: judgments } = await supabase.from('historical_records').select('id, title, metadata').eq('category', 'COURT_JUDGMENT');

  if (!news || !judgments) return;

  let linksFound = 0;

  for (const n of news) {
    const newsTitle = n.title.toLowerCase();
    const linkedJudgments = n.metadata?.linked_judgments || [];
    let updatedMetadata = { ...n.metadata, linked_judgments: [...linkedJudgments] };
    let metadataChanged = false;

    for (const j of judgments) {
      if (linkedJudgments.includes(j.id)) continue;

      const judgmentTitle = j.title.toLowerCase();
      
      // Extraction logic: find common high-value words (surnames, locations)
      const newsWords = newsTitle.split(/[\s|]+/).filter(w => w.length > 4 && !['south', 'africa', 'police', 'arrested', 'killed'].includes(w));
      const matchWords = newsWords.filter(w => judgmentTitle.includes(w));
      
      // Heuristic: If 3 or more high-value words match, it's likely the same case
      if (matchWords.length >= 3) {
         console.log(`Confirmed Link:`);
         console.log(`  [NEWS] ${n.title}`);
         console.log(`  [JUDGMENT] ${j.title}`);
         
         updatedMetadata.linked_judgments.push(j.id);
         metadataChanged = true;

         // Also update Judgment metadata
         const jMetadata = j.metadata || {};
         const jLinkedIncidents = jMetadata.linked_incidents || [];
         if (!jLinkedIncidents.includes(n.id)) {
            await supabase.from('historical_records').update({
                metadata: { ...jMetadata, linked_incidents: [...jLinkedIncidents, n.id] }
            }).eq('id', j.id);
         }
         
         linksFound++;
      }
    }

    if (metadataChanged) {
        await supabase.from('incidents').update({ metadata: updatedMetadata }).eq('id', n.id);
    }
  }

  console.log(`Lifecycle Resolution Finished. Formalized ${linksFound} links in Database.`);
}

resolveLifecycle().catch(console.error);
