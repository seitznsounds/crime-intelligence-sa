import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});

async function findImageFor(name: string) {
    console.log(`Searching for image: ${name}`);
    try {
        const run = await client.actor('apify/google-search-scraper').call({
            queries: `${name} headshot profile image`,
            maxPagesPerQuery: 1,
            resultsPerPage: 10,
            searchType: 'IMAGE'
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        // Google Search Scraper returns images in a specific format
        const imageUrl = (items[0] as any)?.imageUrl;
        if (imageUrl) {
            console.log(`Found image for ${name}: ${imageUrl}`);
            return imageUrl;
        }
        return null;
    } catch (error: any) {
        console.error(`Search failed for ${name}:`, error.message);
        return null;
    }
}

async function main() {
    const targets = [
        { id: '17648316-3943-4468-9c25-c84bcd17d32a', name: 'Vusimuzi Matlala' },
        { id: 'f725a5f8-0c90-43e6-8cd6-b9b26ddf7c98', name: 'Simon Rudland' },
        { id: 'd175d9d3-2b2f-4e27-8f03-ab07aa508b52', name: 'Kamlesh Pattni' },
        { id: 'c912f225-d3fd-475b-8fff-21d96a10385c', name: 'Ralph Stanfield' },
        { id: 'ae422a39-a23b-4d24-9cfa-f607d024f4bc', name: 'Anthony Gounden' }
    ];

    const results = [];
    for (const target of targets) {
        const url = await findImageFor(target.name);
        if (url) {
            results.push({ ...target, url });
        }
    }

    fs.writeFileSync('scratch/scraped_images.json', JSON.stringify(results, null, 2));
    console.log(`Scraped ${results.length} image URLs.`);
}

main();
