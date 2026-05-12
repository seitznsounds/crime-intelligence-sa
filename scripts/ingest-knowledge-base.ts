/**
 * Ingestion Script: ai_knowledge_base JSONL → Supabase
 * 
 * Ingests 3,540 records from the local JSONL file into the
 * newly created ai_knowledge_base table, including 384-dim embeddings.
 * 
 * Usage: npx tsx scripts/ingest-knowledge-base.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const JSONL_PATH = path.resolve(__dirname, '../intelligence/ai_intelligence_ai_knowledge_base.jsonl');
const BATCH_SIZE = 100;

interface KnowledgeRecord {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  embedding: string;
  source: string;
  source_type: string;
  ward_code: string | null;
  image_url: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

async function ingest() {
  console.log('🧠 Crime Intelligence SA — Knowledge Base Ingestion');
  console.log(`📁 Source: ${JSONL_PATH}`);

  if (!fs.existsSync(JSONL_PATH)) {
    console.error('❌ JSONL file not found');
    process.exit(1);
  }

  const fileStream = fs.createReadStream(JSONL_PATH);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let batch: Record<string, unknown>[] = [];
  let total = 0;
  let errors = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;

    try {
      const raw: KnowledgeRecord = JSON.parse(line);

      // Parse the embedding string to a float array
      let embedding: number[] | null = null;
      if (raw.embedding) {
        try {
          embedding = JSON.parse(raw.embedding);
        } catch {
          embedding = null;
        }
      }

      batch.push({
        id: raw.id,
        content: raw.content,
        metadata: raw.metadata || {},
        embedding: embedding,
        source: raw.source,
        source_type: raw.source_type,
        ward_code: raw.ward_code,
        image_url: raw.image_url,
        status: raw.status,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      });

      if (batch.length >= BATCH_SIZE) {
        const { error } = await supabase
          .from('ai_knowledge_base')
          .upsert(batch, { onConflict: 'id', ignoreDuplicates: true });

        if (error) {
          console.error(`❌ Batch error at ${total}: ${error.message}`);
          errors++;
        } else {
          total += batch.length;
          process.stdout.write(`\r✅ Ingested ${total} records...`);
        }
        batch = [];
      }
    } catch (e) {
      errors++;
    }
  }

  // Final batch
  if (batch.length > 0) {
    const { error } = await supabase
      .from('ai_knowledge_base')
      .upsert(batch, { onConflict: 'id', ignoreDuplicates: true });

    if (error) {
      console.error(`\n❌ Final batch error: ${error.message}`);
      errors++;
    } else {
      total += batch.length;
    }
  }

  console.log(`\n\n📊 Ingestion Complete`);
  console.log(`   ✅ Total ingested: ${total}`);
  console.log(`   ❌ Errors: ${errors}`);
}

ingest().catch(console.error);
