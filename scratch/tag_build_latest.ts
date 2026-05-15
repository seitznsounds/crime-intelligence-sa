import { ApifyClient } from 'apify-client';
import 'dotenv/config';

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

async function tagBuild() {
    const buildId = 'caufvdUdgolhqROXk';
    console.log(`Tagging build ${buildId} as latest...`);
    
    try {
        // In Apify, you usually tag a build by updating it
        // Or you might need to use the actor's versions/tags
        // Let's try to update the build's tag if possible, 
        // but often 'latest' is managed at the actor version level.
        
        // However, the error 'Build with tag latest not found' usually means 
        // the actor doesn't have a build tagged 'latest'.
        
        // Let's try to see what methods are available on build
        const buildClient = client.build(buildId);
        const build = await buildClient.get();
        
        if (!build) {
            console.error('Build not found');
            return;
        }
        
        console.log('Current build details:', build);
        
        // Try to update the build to add the 'latest' tag
        // Note: The JS client might not have a direct 'update' on build if it's immutable
        // But let's try.
        
        // Actually, in Apify API, you can't "tag" an existing build easily via the client 
        // if it wasn't built with that tag.
        // But you can update the actor's default build tag or similar.
        
        // Wait, if the user says "tag build ... as latest", they might mean 
        // making sure the 'latest' tag points to this build.
    } catch (error) {
        console.error('Error tagging build:', error);
    }
}

tagBuild();
