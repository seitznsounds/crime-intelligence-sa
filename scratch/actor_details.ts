import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function getActorDetails() {
  try {
    console.log("Fetching details for za_intelligence/news-scraper...");
    const actor = await client.actor("za_intelligence/news-scraper").get();
    console.log("Actor ID:", actor?.id);
    console.log("Actor Name:", actor?.name);
    console.log("Actor Details:", JSON.stringify(actor, null, 2));
  } catch (error: any) {
    console.error("Failed to get actor details:", error.message);
  }
}

getActorDetails();
