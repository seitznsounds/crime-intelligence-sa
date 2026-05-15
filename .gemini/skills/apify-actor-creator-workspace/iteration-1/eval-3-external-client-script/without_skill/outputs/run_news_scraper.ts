import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function runScraper() {
  console.log("Starting 'user/news-scraper' actor...");
  try {
    const run = await client.actor('user/news-scraper').call({
      url: 'https://example.com/news/1',
    });

    console.log('Run ID:', run.id);

    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    if (items.length > 0) {
      console.log('First item:', items[0]);
    } else {
      console.log('No items found in dataset.');
    }
  } catch (error: any) {
    console.error('Error running actor:', error.message);
  }
}

runScraper();
