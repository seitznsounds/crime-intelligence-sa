import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function testActor() {
  try {
    console.log("Starting apify/hello-world...");
    const run = await client.actor("apify/hello-world").start();
    console.log("Success! Run ID:", run.id);
  } catch (error: any) {
    console.error("Failed to start actor:", error.message);
  }
}

testActor();
