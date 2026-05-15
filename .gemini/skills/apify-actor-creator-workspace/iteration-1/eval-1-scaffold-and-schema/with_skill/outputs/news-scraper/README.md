# News Scraper

An Apify actor that scrapes the main headline and publication date from a list of news URLs.

## Input
- `startUrls`: Array of URLs to scrape.

## Output
Each item in the dataset will contain:
- `url`: The URL of the news article.
- `headline`: The main headline of the article.
- `publicationDate`: The publication date of the article.

## Local Development
Run the following command to run the actor locally:
```bash
apify run
```
