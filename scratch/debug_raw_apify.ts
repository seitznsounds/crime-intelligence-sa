import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function rawApifyCall() {
  const token = process.env.APIFY_TOKEN;
  const actorId = "za_intelligence/rag-web-browser";
  const url = `https://api.apify.com/v2/acts/${actorId}/runs?token=${token}`;

  console.log("Calling Apify API via fetch...");
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queries: ["Truth and Reconciliation Commission South Africa"],
        maxPagesPerQuery: 1,
      })
    });

    console.log("Status:", response.status);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log("Body:", text);
  } catch (error: any) {
    console.error("Fetch failed:", error.message);
  }
}

rawApifyCall();
