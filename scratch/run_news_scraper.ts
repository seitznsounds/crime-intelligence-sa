import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function runNewsScraper() {
  const actorId = 'user/news-scraper';
  const url = 'https://example.com/news/1';

  console.log(`Running actor ${actorId} with URL: ${url}`);

  try {
    // Run the actor and wait for it to finish
    const run = await client.actor(actorId).call({
      url,
    });

    console.log('Run ID:', run.id);

    // Fetch the first item from the dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems({
      limit: 1,
    });

    if (items.length > 0) {
      console.log('First item:', items[0]);
    } else {
      console.log('No items found in the dataset.');
    }
  } catch (error) {
    console.error('Error running the news scraper:', error);
  }
}

runNewsScraper();
