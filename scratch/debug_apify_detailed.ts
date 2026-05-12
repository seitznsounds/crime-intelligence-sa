import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function tryRun() {
  try {
    console.log("Calling client.actor(...).start()...");
    const run = await client.actor("za_intelligence/rag-web-browser").start({
      queries: ["TRC report Volume 4"],
      maxPagesPerQuery: 1
    });
    console.log("Success! Run ID:", run.id);
  } catch (error: any) {
    console.log("Error details:");
    console.log("Message:", error.message);
    console.log("Status Code:", error.statusCode);
    console.log("Response:", JSON.stringify(error.response?.body, null, 2));
  }
}

tryRun();
