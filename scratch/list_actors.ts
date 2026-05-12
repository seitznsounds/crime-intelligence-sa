import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function listMyActors() {
  try {
    console.log("Listing actors for this account...");
    const actors = await client.actors().list();
    console.log("Found actors:", actors.items.map(a => a.name));
  } catch (error: any) {
    console.error("Failed to list actors:", error.message);
  }
}

listMyActors();
