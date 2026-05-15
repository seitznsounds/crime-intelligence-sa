---
name: apify-actor-creator
description: Create, modify, debug, and deploy Apify Actors. Use this skill whenever the user mentions building web scrapers, automation tasks, or serverless programs on the Apify platform. It covers everything from initial scaffolding and schema definition to Crawlee implementation and external client integration.
---

# Apify Actor Creator

A specialized skill for developing high-quality Apify Actors using the best practices established in the workspace and official Apify documentation.

## Core Mandates

1.  **UNIX Philosophy**: Build actors that do one thing well and can be easily composed.
2.  **Performance First**: ALWAYS prefer `CheerioCrawler` (HTTP-only) over `PlaywrightCrawler` (Browser) whenever possible (10x faster).
3.  **Schema-Driven**: ALWAYS define `.actor/input_schema.json`, `.actor/output_schema.json`, and `.actor/dataset_schema.json`.
4.  **Local-First Development**: Use `apify run` and local storage in `storage/` for testing before pushing to the cloud.
5.  **Implementation Focus**: When asked to implement or modify an actor, prioritize the actual crawling and data processing logic over structural boilerplate.

## Do's and Don'ts

### Do
- Accept well-defined JSON input and produce structured JSON output.
- Use Apify SDK (`apify`) for code running ON Apify platform.
- Validate input early with proper error handling and fail gracefully.
- Use router pattern (`createCheerioRouter`/`createPlaywrightRouter`) for complex crawls.
- Implement retry strategies with exponential backoff for failed requests.
- Use proper concurrency settings (HTTP: 10-50, Browser: 1-5).
- Set up output schema in `.actor/output_schema.json` and dataset views in `.actor/dataset_schema.json`.
- Respect `robots.txt`, ToS, and implement rate limiting with delays.

### Don't
- Do not use browser crawlers when HTTP/Cheerio works.
- Do not hardcode values that should be in input schema or environment variables.
- Do not rely on `Dataset.getInfo()` for final counts on Cloud platform.
- Do not skip input validation or error handling.
- Do not use deprecated options like `requestHandlerTimeoutMillis` on `CheerioCrawler` (v3.x).
- Do not use `additionalHttpHeaders` - use `preNavigationHooks` instead.

## Workflow

### 1. Scaffolding (New Actors)
Set up the standard directory structure in `.actors/<actor-name>/`. Ensure `package.json` includes `apify` and `crawlee`.

### 2. Schema Definition
- **Input Schema**: Use editors like `requestListSources` for URLs and `proxy` for settings.
- **Dataset Schema**: Define the `overview` view with appropriate formats (`link`, `text`, `date`, `number`).

### 3. Implementation (Logic)
- Use `Actor.getInput()` to retrieve and validate parameters.
- Implement the `requestHandler` with specific extraction logic.
- Use `pushData` to store results.
- Add `failedRequestHandler` to handle persistent failures.

### 4. Debugging & Deployment
- `apify run` to test locally.
- `apify push` to deploy (ASK user first).

## MCP Server Configurations
The following MCP servers can be used to interact with Apify and GitHub:

### Apify MCP
```json
{
  "mcpServers": {
    "apify": {
      "description": "Extract data from social media, search engines, maps, and e-commerce sites using Apify's ready-made scrapers and actors via MCP.",
      "command": "npx",
      "args": ["-y", "@apify/actors-mcp-server"],
      "env": {
        "APIFY_TOKEN": "<token-from-env>"
      }
    }
  }
}
```

### GitHub MCP
```json
{
  "mcpServers": {
    "github-official": {
      "description": "GitHub's official MCP Server. Interact with GitHub repositories, issues, pull requests, and more directly from Claude.",
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<token-from-env>"
      }
    }
  }
}
```

## Safety Rules
- **NEVER** hardcode secrets or tokens.
- **ASK** before running `apify push` or installing new npm packages.
- **VERIFY** compliance with target site ToS.

