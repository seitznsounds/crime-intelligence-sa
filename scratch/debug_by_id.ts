import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function tryRunById() {
  const actorId = "qlUHrtbRqnWuo4mGt";
  try {
    console.log(`Starting actor ${actorId}...`);
    const run = await client.actor(actorId).start({
      query: "TRC report Volume 4",
      proxyConfiguration: {
        useApifyProxy: true,
      }
    });
    console.log("Success! Run ID:", run.id);
  } catch (error: any) {
    console.error("Failed to start actor:", error.message);
    if (error.response?.body) {
      console.error("Response:", JSON.stringify(error.response.body, null, 2));
    }
  }
}

tryRunById();
