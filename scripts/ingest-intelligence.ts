import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: { schema: 'public' }
  }
);

const BATCH_SIZE = 200;
const MAX_RETRIES = 5;

async function upsertBatch(tableName: string, records: any[], retryCount = 0) {
  const cleanRecords = records.map(r => {
    const clean: any = { metadata: {} };
    const knownColumns = [
      'id', 'full_name', 'role', 'risk_score', 'pep_tier', 'status', 'profile_image_url',
      'title', 'summary', 'occurred_at', 'crime_category', 'location', 'station_name',
      'social_media_handles', 'source_file', 'verification_source', 'address', 'age',
      'date_of_birth', 'email', 'phone', 'phone_number', 'is_verified', 'created_at',
      'updated_at', 'published', 'raw_content', 'source_feed', 'technologies'
    ];

    Object.entries(r).forEach(([key, value]) => {
      let val = value;
      if (val === 'null' || val === 'NULL' || val === '') val = null;
      
      if (key.includes('at') || key.includes('date') || key === 'occurred_at') {
        if (typeof val === 'string' && /^\d{4}$/.test(val)) {
          val = `${val}-01-01T00:00:00Z`;
        }
      }

      if (key === 'geom' || key === 'location_point' || key === 'embedding') return;

      if (knownColumns.includes(key)) {
        clean[key] = val;
      } else {
        clean.metadata[key] = val;
      }
    });

    return clean;
  });

  try {
    const { error } = await supabase
      .from(tableName)
      .upsert(cleanRecords, { onConflict: 'id' });

    if (error) {
      const missingColumnMatch = error.message.match(/Could not find the '(.*)' column/) || 
                                 error.message.match(/column "(.*)" of relation/);
      
      if (missingColumnMatch) {
        const columnName = missingColumnMatch[1];
        console.warn(`Column '${columnName}' missing in ${tableName}. Moving to metadata and retrying...`);
        const reducedRecords = records.map(r => {
          const { [columnName]: _, ...rest } = r;
          return rest;
        });
        return upsertBatch(tableName, reducedRecords, retryCount);
      }

      if (error.message.includes('timeout') && retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.warn(`Timeout in ${tableName}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return upsertBatch(tableName, records, retryCount + 1);
      }
      throw error;
    }
  } catch (err: any) {
    console.error(`Error in ${tableName}:`, err.message);
  }
}

async function processFile(filePath: string, tableName: string) {
  console.log(`Starting ingestion: ${path.basename(filePath)} -> ${tableName}`);
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let batch: any[] = [];
  let count = 0;

  for await (const line of rl) {
    try {
      const record = JSON.parse(line);
      batch.push(record);
      if (batch.length >= BATCH_SIZE) {
        await upsertBatch(tableName, batch);
        batch = [];
        count += BATCH_SIZE;
        process.stdout.write(`\rProcessed ${count} records in ${tableName}...`);
      }
    } catch (e) {
      // Skip invalid JSON lines
    }
  }

  if (batch.length > 0) {
    await upsertBatch(tableName, batch);
  }
  console.log(`\nCompleted ${path.basename(filePath)}: ${count + batch.length} records total.`);
}

const FILE_MAPPING = {
  'crime_intelligence_incidents.jsonl': 'incidents',
  'crime_intelligence_station_statistics.jsonl': 'station_statistics',
  'people_intelligence_master_identities.jsonl': 'people',
  'ai_intelligence_ai_news.jsonl': 'ai_news',
  'ai_intelligence_historical_records.jsonl': 'historical_records'
};

async function run() {
  const intelDir = path.join(process.cwd(), 'intelligence');
  for (const [fileName, tableName] of Object.entries(FILE_MAPPING)) {
    const filePath = path.join(intelDir, fileName);
    if (fs.existsSync(filePath)) {
      await processFile(filePath, tableName);
    }
  }
}

run().catch(console.error);
