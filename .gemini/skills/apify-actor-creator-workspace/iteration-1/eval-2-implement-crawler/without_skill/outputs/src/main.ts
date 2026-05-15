import { Actor } from 'apify';
import { CheerioCrawler, log } from 'crawlee';

await Actor.init();

interface Input {
    startUrls: string[];
}

const input = await Actor.getInput<Input>();

if (!input || !input.startUrls) {
    throw new Error('Input must contain startUrls!');
}

const crawler = new CheerioCrawler({
    // Maximum number of requests per crawl
    maxRequestsPerCrawl: 50,
    
    // This function will be called for each URL to crawl
    async requestHandler({ $, request, pushData }) {
        log.info(`Processing ${request.url}...`);

        try {
            // Extract headline
            const headline = $('h1').first().text().trim();

            if (!headline) {
                log.warning(`Could not find headline for ${request.url}`);
            }

            // Extract publication date
            // Try different common meta tags and elements for publication date
            const publicationDate = 
                $('meta[name="pubdate"]').attr('content') ||
                $('meta[property="article:published_time"]').attr('content') ||
                $('meta[name="date"]').attr('content') ||
                $('meta[name="sailthru.date"]').attr('content') ||
                $('meta[itemprop="datePublished"]').attr('content') ||
                $('time[datetime]').attr('datetime') ||
                $('time').first().attr('datetime') ||
                $('time').first().text().trim();

            if (!publicationDate) {
                log.warning(`Could not find publication date for ${request.url}`);
            }

            // Push the results to the default dataset
            await pushData({
                url: request.url,
                headline: headline || 'N/A',
                publicationDate: publicationDate || 'N/A',
                scrapedAt: new Date().toISOString(),
            });
            
            log.info(`Successfully scraped ${request.url}`);

        } catch (error) {
            log.error(`Error scraping ${request.url}: ${(error as Error).message}`);
            // We still want to track that we failed this request
            await pushData({
                url: request.url,
                error: (error as Error).message,
                failed: true,
                scrapedAt: new Date().toISOString(),
            });
        }
    },

    // This function is called if the page processing failed more than maxRequestRetries times
    failedRequestHandler({ request }) {
        log.error(`Request ${request.url} failed multiple times.`);
    },
});

log.info('Starting the crawler...');
await crawler.run(input.startUrls);
log.info('Crawler finished.');

await Actor.exit();
