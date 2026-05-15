import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function runNewsScraper() {
  const actorId = 'za_intelligence/news-scraper'; // Example ID, change to your actor's ID
  
  console.log(`Starting actor ${actorId}...`);
  
  try {
    const run = await client.actor(actorId).start({
      startUrls: [
        { url: 'https://www.news24.com/news24/southafrica/news/police-investigating-after-body-of-man-found-in-cape-town-harbour-20240515' }
      ],
      maxItems: 1
    });

    console.log(`Run started: ${run.id}`);
    console.log(`Waiting for run to finish...`);
    
    await client.run(run.id).waitForFinish();
    
    console.log(`Run finished! Fetching results...`);
    
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    console.log('Scraped Data:');
    console.log(JSON.stringify(items, null, 2));
    
  } catch (error: any) {
    console.error('Error running news-scraper:', error.message);
  }
}

// Note: To run this locally, you'll need to deploy the actor first with 'apify push'
// or run the actor's main.js directly with mocked input.
// runNewsScraper();

console.log('Example usage script for news-scraper created.');
console.log('To run locally for testing (without cloud deployment):');
console.log('1. cd .actors/news-scraper');
console.log('2. Create storage/key_value_stores/default/INPUT.json with your test URLs');
console.log('3. apify run');
