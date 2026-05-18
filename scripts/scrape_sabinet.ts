import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { mapToStandardCategory } from './standardize_categories';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function scrapeSabinet() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    const searchQuery = 'murder OR rape OR gang OR drug OR extortion OR "cash-in-transit" OR kidnapping OR hijacking OR corruption OR "illegal mining" OR "zama zama"';
    const searchUrl = `https://discover.sabinet.co.za/search?Search=${encodeURIComponent(searchQuery)}&ProductType=sabinetjudgments&resultsortOption=%22Date+Newest+first%22`;
    
    console.log(`Navigating to targeted search: ${searchUrl}`);
    
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 });

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
    const maxPages = 50; 
    
    while (currentPage <= maxPages) {
      console.log(`\n--- SCRAPING PAGE ${currentPage} ---`);
      try {
        await page.waitForSelector('.ant-list-item', { timeout: 20000 });
      } catch (e) {
        break;
      }
      
      const results = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.ant-list-item'));
        return items.map(item => {
          const title = item.querySelector('.ant-list-item-meta-title')?.textContent?.trim() || 'Untitled';
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
          const subject = metadata['Subject'] || '';
          return { title, metadata, url, subject };
        });
      });

      for (const data of results) {
        if (data.title === 'Untitled') continue;
        
        const lowerSubject = data.subject.toLowerCase();
        const lowerTitle = data.title.toLowerCase();
        const skipKeywords = ['domestic relations', 'parents and children', 'marriage', 'divorce', 'maintenance', 'insolvency', 'taxation', 'labor', 'home affairs'];
        
        if (skipKeywords.some(kw => lowerSubject.includes(kw) || lowerTitle.includes(kw))) continue;

        const { data: existing } = await supabase.from('historical_records').select('id').eq('title', data.title).maybeSingle();
        if (existing) continue;

        console.log(`  -> Analyzing: ${data.title}`);
        const keywords = data.metadata['Keywords'] ? data.metadata['Keywords'].split(',').map(k => k.trim()) : [];
        let detailedMetadata = { ...data.metadata };
        let fullContent = "";
        
        // Extract location from title [Location]
        if (!detailedMetadata['Court Location'] && data.title.includes('[')) {
            const locMatches = data.title.match(/\[(.*?)\]/g);
            if (locMatches && locMatches.length > 0) {
                const lastMatch = locMatches[locMatches.length - 1].replace(/[\[\]]/g, '');
                if (lastMatch.length > 3) detailedMetadata['Court Location'] = lastMatch;
            }
        }

        const highImpactKeywords = ['murder', 'rape', 'gang', 'drug', 'extortion', 'cash-in-transit', 'kidnapping', 'hijacking'];
        const isHighImpact = keywords.some(k => highImpactKeywords.some(hik => k.toLowerCase().includes(hik)));

        if (isHighImpact && data.url) {
          console.log(`  -> HIGH IMPACT: Visiting detail page...`);
          const detailPage = await context.newPage();
          try {
            await detailPage.goto(data.url, { waitUntil: 'networkidle', timeout: 30000 });
            const deepData = await detailPage.evaluate(() => {
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
            detailedMetadata = { ...detailedMetadata, ...deepData.metadata };
            fullContent = deepData.content;
          } catch (e) {
          } finally {
            await detailPage.close();
          }
        }

        await supabase.from('historical_records').insert({
          title: data.title,
          summary: detailedMetadata['AI Summary'] || '',
          content: fullContent || JSON.stringify(detailedMetadata),
          category: 'COURT_JUDGMENT',
          tags: [...keywords, 'sabinet', 'criminal-judgment', 'deep-extraction'],
          source_url: data.url || searchUrl,
          metadata: detailedMetadata,
          event_date: detailedMetadata['Judgment Date'] || detailedMetadata['Date'] || new Date().toISOString()
        });
        console.log(`  -> Ingested (Location: ${detailedMetadata['Court Location'] || 'Unknown'}).`);
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
    console.error(`Scraper Error: ${err.message}`);
  } finally {
    await browser.close();
  }
}

scrapeSabinet().catch(console.error);
