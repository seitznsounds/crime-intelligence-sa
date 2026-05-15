import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function listBuilds() {
  const actorId = 'za_intelligence/news-scraper';
  try {
    console.log(`Listing builds for ${actorId}...`);
    const builds = await client.actor(actorId).builds().list();
    console.log("Builds:", JSON.stringify(builds, null, 2));
  } catch (error: any) {
    console.error("Failed to list builds:", error.message);
  }
}

listBuilds();
