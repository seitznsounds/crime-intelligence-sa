import 'dotenv/config';

async function tagBuild() {
    const actorId = 'za_intelligence~news-scraper';
    const buildId = 'caufvdUdgolhqROXk';
    const tag = 'latest';
    const token = process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN;

    console.log(`Tagging build ${buildId} as ${tag}...`);

    try {
        const url = `https://api.apify.com/v2/acts/${actorId}/builds/${buildId}/tags/${tag}?token=${token}`;
        const response = await fetch(url, {
            method: 'POST'
        });
        
        if (response.ok) {
            console.log('Success: Tag updated');
        } else {
            const data = await response.json();
            console.error('Error tagging build:', data);
        }
    } catch (error: any) {
        console.error('Error tagging build:', error.message);
    }
}

tagBuild();
