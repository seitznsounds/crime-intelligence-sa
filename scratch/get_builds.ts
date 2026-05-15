import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function getBuilds() {
  const actorId = 'za_intelligence/news-scraper';
  try {
    const builds = await client.actor(actorId).builds().list();
    console.log(`Builds for ${actorId}:`);
    builds.items.forEach(b => {
      console.log(`- ID: ${b.id}, Status: ${b.status}, Finished: ${b.finishedAt}`);
    });
  } catch (error: any) {
    console.error("Failed to get builds:", error.message);
  }
}

getBuilds();
