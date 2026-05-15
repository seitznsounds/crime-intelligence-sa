import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function testBuildId() {
  const actorId = 'jWmQZoFPtRo03eyrd'; // za_intelligence/news-scraper ID
  const buildNum = '1.0.1';
  const input = { 
    query: "test",
    startUrls: [{ url: "https://www.google.com" }]
  };

  try {
    console.log(`Testing call with build number ${buildNum} using Actor ID ${actorId}...`);
    const run = await client.actor(actorId).call(input, { build: buildNum, waitSecs: 10 });
    console.log("Run successful, ID:", run.id);
  } catch (error: any) {
    console.error("Test failed:", error.message);
  }
}

testBuildId();
