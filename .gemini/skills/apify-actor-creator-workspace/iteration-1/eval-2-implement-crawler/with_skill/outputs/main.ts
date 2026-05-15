import { Actor } from 'apify';

/**
 * News Scraper Actor
 * 
 * This actor takes a list of URLs and is intended to scrape the main headline 
 * and publication date from each news article.
 * 
 * The crawling logic is not yet implemented.
 */

await Actor.init();

interface Input {
    startUrls: { url: string }[];
}

const input = await Actor.getInput<Input>();
if (!input) {
    throw new Error('Input is missing!');
}

console.log('Actor started with input:', input);

// TODO: Implement crawling logic using CheerioCrawler or similar.
// Headline and Publication Date should be extracted.

await Actor.exit();
