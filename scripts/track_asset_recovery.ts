import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function trackRecoveries() {
  console.log("Analyzing judgments for asset recovery values (Advanced)...");
  
  const { data: judgments, error } = await supabase
    .from('historical_records')
    .select('id, title, content, metadata')
    .eq('category', 'COURT_JUDGMENT')
    .or('title.ilike.%NDPP%,title.ilike.%forfeiture%,content.ilike.%forfeiture%');

  if (error || !judgments) return;

  // Regex to find amounts like R123,456.78 or 1.5 million
  const amountRegex = /R\s?(\d{1,3}(,\d{3})*(\.\d{2})?)/g;
  const millionRegex = /(\d+(\.\d+)?)\s?million/gi;

  let totalRecovered = 0;

  for (const j of judgments) {
    const text = j.content || "";
    const title = j.title || "";
    
    // Skip if it looks like a maintenance or divorce case (even if NDPP is involved?)
    if (title.includes('maintenance') || title.includes('divorce')) continue;

    const millionMatches = [...text.matchAll(millionRegex)];
    const valMatches = [...text.matchAll(amountRegex)];
    
    let foundValue = 0;
    
    if (millionMatches.length > 0) {
        foundValue = parseFloat(millionMatches[0][1]) * 1000000;
    } else if (valMatches.length > 0) {
        // Find the largest value in the text that isn't an obviously high year or section ref
        const values = valMatches.map(m => parseFloat(m[1].replace(/,/g, ''))).filter(v => v > 1000 && v < 1000000000);
        if (values.length > 0) foundValue = Math.max(...values);
    }

    if (foundValue > 0) {
        console.log(`\nDetected Potential Recovery: ${title}`);
        console.log(`  Extracted Value: R${foundValue.toLocaleString()}`);
        
        const metadata = j.metadata || {};
        await supabase.from('historical_records').update({
            metadata: { 
                ...metadata, 
                recovery_value: foundValue, 
                recovery_status: "SEIZED_BY_STATE",
                asset_type: "State Asset Recovery" 
            },
            tags: [...(j.tags || []), 'asset-recovery']
        }).eq('id', j.id);
        
        totalRecovered += foundValue;
    }
  }

  console.log(`\nRecovery Tracking Finished. Total Identified: R${totalRecovered.toLocaleString()}`);
}

trackRecoveries().catch(console.error);
