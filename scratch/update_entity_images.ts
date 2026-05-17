import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadAndUpdate(entityId: string, entityName: string, type: 'people' | 'organizations', imageUrl: string) {
    console.log(`\n--- Processing: ${entityName} (${entityId}) ---`);
    try {
        console.log(`Downloading image from: ${imageUrl}`);
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Referer': 'https://www.google.com/'
            }
        });
        
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        const buffer = await response.arrayBuffer();
        
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        let ext = '.jpg';
        if (contentType.includes('webp')) ext = '.webp';
        if (contentType.includes('png')) ext = '.png';
        
        const fileName = `${type}/${entityId}${ext}`;
        
        console.log(`Uploading to bucket 'entity_images' as '${fileName}'...`);
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('entity_images')
            .upload(fileName, buffer, {
                contentType,
                upsert: true
            });

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
            .from('entity_images')
            .getPublicUrl(fileName);

        console.log(`Public URL: ${publicUrl}`);

        const column = type === 'people' ? 'profile_image_url' : 'image_url';
        const { error: dbError } = await supabase
            .from(type)
            .update({ [column]: publicUrl })
            .eq('id', entityId);

        if (dbError) throw new Error(`DB update failed: ${dbError.message}`);

        console.log(`✅ Success for ${entityName}`);
        return { success: true, publicUrl, name: entityName };
    } catch (error: any) {
        console.error(`❌ Error for ${entityName}:`, error.message);
        return { success: false, error: error.message, name: entityName };
    }
}

async function main() {
    const targets = [
        {
            id: '17648316-3943-4468-9c25-c84bcd17d32a',
            name: 'Vusimuzi Matlala',
            type: 'people',
            url: 'https://sundayworld-prod-s3-bucket.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/11/08152330/P16-Vusimuzi-Cat-Matlala-e1764174578852.jpg'
        },
        {
            id: 'f725a5f8-0c90-43e6-8cd6-b9b26ddf7c98',
            name: 'Simon Rudland',
            type: 'people',
            url: 'https://www.aljazeera.com/wp-content/uploads/2023/03/Gold-Mafia-Composite.jpg'
        },
        {
            id: 'd175d9d3-2b2f-4e27-8f03-ab07aa508b52',
            name: 'Kamlesh Pattni',
            type: 'people',
            url: 'https://www.aljazeera.com/wp-content/uploads/2023/03/Kamlesh-Pattni-shaking-the-hand-of-Robert-Mugabe.jpg'
        }
    ];

    const results = [];
    for (const target of targets) {
        const res = await uploadAndUpdate(target.id as string, target.name, target.type as 'people' | 'organizations', target.url);
        results.push(res);
    }

    // Update log
    const logPath = path.join(process.cwd(), '.research', 'to-ingest', 'DOSSIER_UPDATE.md');
    let logContent = fs.readFileSync(logPath, 'utf-8');
    
    results.forEach(res => {
        if (res.success) {
            // Find the line and update it
            const lines = logContent.split('\n');
            const index = lines.findIndex(l => l.includes(`**${res.name}**`));
            if (index !== -1) {
                lines[index] = `| **${res.name}** | Success | Source URL | ${res.publicUrl} | Linked |`;
            }
            logContent = lines.join('\n');
        }
    });

    fs.writeFileSync(logPath, logContent);
    console.log("\nLog updated.");
}

main();
