import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function backfillDeepContent() {
  console.log("Backfilling full text for high-impact judgments (Robust Version)...");
  
  const { data: targets, error } = await supabase
    .from('historical_records')
    .select('id, title, source_url, tags, metadata')
    .eq('category', 'COURT_JUDGMENT')
    .not('content', 'ilike', '%The Appellant%')
    .limit(10); // Small batch

  if (error || !targets) return;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Robust Login
  try {
    console.log("Navigating to login...");
    await page.goto('https://discover.sabinet.co.za/login', { waitUntil: 'networkidle' });
    
    // Check if we need to click login button first (sometimes it's a modal)
    const loginBtn = page.locator('.login-btn');
    if (await loginBtn.count() > 0) {
        await loginBtn.first().dispatchEvent('click');
        await page.waitForSelector('#signin_username', { state: 'visible' });
    }

    console.log("Filling credentials...");
    await page.fill('#signin_username', process.env.SABINET_USERNAME!);
    await page.fill('#signin_password', process.env.SABINET_PASSWORD!);
    await page.locator('button:has-text("Sign in"), button:has-text("Login"), button[type="submit"]').last().dispatchEvent('click');
    await page.waitForTimeout(10000);
    console.log("Login sequence finished.");

    for (const t of targets) {
      if (!t.source_url) continue;
      
      console.log(`\nProcessing: ${t.title}`);
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
               if (listItems.length > 0) metadata[label] = Array.from(new Set(listItems.map(li => li.textContent?.trim()))).filter(Boolean);
               else metadata[label] = valueEl.textContent?.trim();
            }
          });
          const contentEl = document.querySelector('.paywall-content, .item-content-loaded, .document-content, #main-content, article');
          return { metadata, content: contentEl?.textContent?.trim() || '' };
        });

        if (deepData.content) {
          console.log(`  -> Extracted ${deepData.content.length} characters.`);
          await supabase.from('historical_records').update({
              content: deepData.content,
              metadata: { ...t.metadata, ...deepData.metadata },
              tags: [...(t.tags || []), 'deep-extraction', 'criminal-judgment']
          }).eq('id', t.id);
          console.log(`  -> Database updated.`);
        }
      } catch (e: any) {
        console.error(`  -> Error: ${e.message}`);
      }
    }
  } catch (err: any) {
    console.error(`Fatal Error: ${err.message}`);
  } finally {
    await browser.close();
    console.log("\nDeep backfill session complete.");
  }
}

backfillDeepContent().catch(console.error);
