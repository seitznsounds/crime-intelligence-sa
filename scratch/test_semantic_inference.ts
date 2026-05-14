import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSemanticInference() {
  const targetName = 'Zuma';
  console.log(`Analyzing Semantic Links for: ${targetName}`);

  // 1. Find KB entries mentioning the target
  const { data: kbEntries, error: kbError } = await supabase
    .from('ai_knowledge_base')
    .select('id, content, embedding')
    .ilike('content', `%${targetName}%`)
    .limit(5);

  if (kbError || !kbEntries) {
    console.error('Error:', kbError?.message);
    return;
  }

  console.log(`Found ${kbEntries.length} documents mentioning ${targetName}.`);

  for (const entry of kbEntries) {
    console.log(`\nDocument ID: ${entry.id}`);
    
    // 2. Find similar documents via vector similarity
    const { data: similar, error: simError } = await supabase.rpc('search_knowledge_base', {
        query_embedding: entry.embedding,
        match_threshold: 0.8,
        match_count: 5
    });

    if (simError) {
        console.error('Sim Error:', simError.message);
        continue;
    }

    console.log(`Found ${similar.length} semantically similar documents.`);
    
    // 3. Extract potential other people from these documents
    // (This is a bit complex without a NER tool, but we can look for other names in the content)
    // For now, let's just list the titles or summaries of similar docs.
    for (const sim of similar) {
        console.log(` -> Similar Doc: ${sim.content.substring(0, 100)}...`);
    }
  }
}

testSemanticInference();
