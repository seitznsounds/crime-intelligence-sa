import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function listActors() {
  try {
    const actors = await client.actors().list();
    console.log("Available Actors:");
    actors.items.forEach(a => {
      console.log(`- ${a.username}/${a.name} (ID: ${a.id})`);
    });
  } catch (error: any) {
    console.error("Failed to list actors:", error.message);
  }
}

listActors();
