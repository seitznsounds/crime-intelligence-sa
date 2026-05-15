import { Actor } from 'apify';
import { CheerioCrawler } from 'crawlee';

await Actor.init();

interface Input {
    startUrls: string[];
}

const input = await Actor.getInput<Input>();
if (!input) {
    throw new Error('Input is missing!');
}

const crawler = new CheerioCrawler({
    async requestHandler({ $, request, pushData }) {
        // Scrape headline and publication date
        const headline = $('h1').first().text().trim();
        // This is a placeholder for publication date logic
        const publicationDate = new Date().toISOString(); 

        await pushData({
            url: request.url,
            headline,
            publicationDate,
        });
    },
});

await crawler.run(input.startUrls);

await Actor.exit();
