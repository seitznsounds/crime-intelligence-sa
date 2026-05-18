import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function scrapeGazettes() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    // Search for strictly forensic signals in Gazettes
    const searchQuery = '("liquidation" OR "sequestrated" OR "tender awarded" OR "forfeiture order" OR "insolvent") NOT "journal article"';
    const searchUrl = `https://discover.sabinet.co.za/search?Search=${encodeURIComponent(searchQuery)}&ProductType=sabinetgazettes&resultsortOption=%22Date+Newest+first%22`;
    
    console.log(`Navigating to Gazette search: ${searchUrl}`);
    
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 });

    // Handle Login if needed
    const loginBtn = page.locator('.login-btn');
    if (await loginBtn.count() > 0) {
      console.log("Logging in...");
      await loginBtn.first().dispatchEvent('click');
      await page.waitForSelector('#signin_username', { state: 'visible' });
      await page.fill('#signin_username', process.env.SABINET_USERNAME!);
      await page.fill('#signin_password', process.env.SABINET_PASSWORD!);
      await page.locator('button:has-text("Sign in"), button:has-text("Login"), button[type="submit"]').last().dispatchEvent('click');
      await page.waitForTimeout(10000);
      await page.goto(searchUrl, { waitUntil: 'networkidle' });
    }

    let currentPage = 1;
    const maxPages = 5; // Start small
    
    while (currentPage <= maxPages) {
      console.log(`\n--- SCRAPING GAZETTE PAGE ${currentPage} ---`);
      try {
        await page.waitForSelector('.ant-list-item', { timeout: 20000 });
      } catch (e) {
        console.log("End of results or timeout.");
        break;
      }
      
      const results = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.ant-list-item'));
        return items.map(item => {
          const title = item.querySelector('.ant-list-item-meta-title')?.textContent?.trim() || 'Untitled Gazette';
          const metadata: Record<string, string> = {};
          const tags = item.querySelectorAll('.ant-tag');
          tags.forEach(tag => {
            const strong = tag.querySelector('strong');
            if (strong) {
              const label = strong.textContent?.replace(':', '').trim() || '';
              const value = tag.textContent?.replace(strong.textContent || '', '').trim() || '';
              if (label && value) metadata[label] = value;
            }
          });
          const link = item.querySelector('a');
          const url = link ? (link as HTMLAnchorElement).href : null;
          return { title, metadata, url };
        });
      });

      for (const data of results) {
        if (data.title === 'Untitled Gazette') continue;

        // Skip non-gazette matters
        const type = (data.metadata['Document Type'] || '').toLowerCase();
        if (type.includes('journal') || type.includes('article')) {
            console.log(`  -> Skipping non-gazette item: ${data.title}`);
            continue;
        }

        const { data: existing } = await supabase.from('historical_records').select('id').eq('title', data.title).maybeSingle();
        if (existing) continue;

        console.log(`  -> Ingesting Gazette: ${data.title}`);
        
        await supabase.from('historical_records').insert({
          title: data.title,
          summary: data.metadata['AI Summary'] || 'Official Government Gazette Record',
          content: JSON.stringify(data.metadata),
          category: 'GOVERNMENT_GAZETTE',
          tags: ['sabinet', 'gazette', 'forensic-signal'],
          source_url: data.url || searchUrl,
          metadata: data.metadata,
          event_date: data.metadata['Date'] || data.metadata['Publication Date'] || new Date().toISOString()
        });
      }

      const nextButton = page.locator('a:has-text("Next"), .ant-pagination-next:not(.ant-pagination-disabled)');
      if (await nextButton.count() > 0) {
        await nextButton.first().dispatchEvent('click');
        await page.waitForTimeout(5000); 
        await page.waitForLoadState('networkidle').catch(() => {});
        currentPage++;
      } else {
        break;
      }
    }
  } catch (err: any) {
    console.error(`Gazette Scraper Error: ${err.message}`);
  } finally {
    await browser.close();
  }
}

scrapeGazettes().catch(console.error);
