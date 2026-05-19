import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function enrichJudgments() {
  console.log("Enriching judgments with Legal Representation data...");
  
  // Get judgments missing detailed metadata
  const { data: targets, error } = await supabase
    .from('historical_records')
    .select('id, title, source_url, metadata')
    .eq('category', 'COURT_JUDGMENT')
    .is('metadata->Legal Representation', null)
    .limit(20); // Small batch for prototype

  if (error || !targets) return;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login sequence
  console.log("Logging into Sabinet...");
  await page.goto('https://discover.sabinet.co.za/login');
  await page.fill('#signin_username', process.env.SABINET_USERNAME!);
  await page.fill('#signin_password', process.env.SABINET_PASSWORD!);
  await page.locator('button:has-text("Sign in"), button:has-text("Login"), button[type="submit"]').last().dispatchEvent('click');
  await page.waitForTimeout(10000);

  for (const t of targets) {
    if (!t.source_url) continue;
    
    console.log(`\nEnriching: ${t.title}`);
    try {
      await page.goto(t.source_url, { waitUntil: 'networkidle', timeout: 30000 });
      
      const deepData = await page.evaluate(() => {
        const metadata: Record<string, any> = {};
        document.querySelectorAll('.metaDataLabel').forEach(labelEl => {
          const label = labelEl.textContent?.trim().replace(/AI Summary|AI Keywords/g, '').trim();
          if (!label) return;

          const parentRow = labelEl.closest('.ant-row');
          const valueEl = parentRow?.querySelector('.metaDataValue');
          
          if (valueEl) {
            const listItems = Array.from(valueEl.querySelectorAll('.ant-list-item, .ant-tag, span, button span')).filter(el => {
               const text = el.textContent?.trim();
               return text && !text.includes(':') && text.length > 1;
            });

            if (listItems.length > 0) {
              metadata[label] = Array.from(new Set(listItems.map(li => li.textContent?.trim()))).filter(Boolean);
            } else {
              metadata[label] = valueEl.textContent?.trim();
            }
          }
        });
        return metadata;
      });

      if (deepData['Legal Representation'] || deepData['Legal Rep']) {
        console.log(`  -> Found Legal Rep: ${JSON.stringify(deepData['Legal Representation'] || deepData['Legal Rep'])}`);
        await supabase.from('historical_records').update({
            metadata: { ...t.metadata, ...deepData }
        }).eq('id', t.id);
        console.log(`  -> Record enriched.`);
      } else {
        console.log(`  -> Legal Rep not found on page.`);
      }
    } catch (e: any) {
      console.error(`  -> Failed: ${e.message}`);
    }
  }

  await browser.close();
  console.log("\nEnrichment session complete.");
}

enrichJudgments().catch(console.error);
