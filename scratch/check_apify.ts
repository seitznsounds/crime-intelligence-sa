import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function checkToken() {
  try {
    const user = await client.user('me').get();
    console.log("Token is valid. User:", user?.username || user?.id);
  } catch (error: any) {
    console.error("Token check failed:", error.message);
  }
}

checkToken();
