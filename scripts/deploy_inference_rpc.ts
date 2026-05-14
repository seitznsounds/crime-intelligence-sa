import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sql = `
CREATE OR REPLACE FUNCTION infer_corruption_links(target_id UUID)
RETURNS TABLE (
    predicted_entity_id UUID,
    predicted_entity_name TEXT,
    confidence_score FLOAT,
    inference_type TEXT,
    evidence_reasoning TEXT
) AS $$
DECLARE
    target_person_name TEXT;
    target_vector VECTOR(384);
BEGIN
    -- 1. Get the target person's name
    SELECT full_name INTO target_person_name FROM people WHERE id = target_id;
    
    -- 2. Try to get a representative vector for this person from the knowledge base
    -- We take the average embedding of docs mentioning them
    SELECT avg(embedding) INTO target_vector 
    FROM ai_knowledge_base 
    WHERE content ILIKE '%' || target_person_name || '%';

    -- 3. Combine Graph and Semantic Inference
    RETURN QUERY
    WITH graph_matches AS (
        -- People who share the same associates
        SELECT 
            p.id as entity_id,
            p.full_name as name,
            75.0::FLOAT as score,
            'Graph Inference'::TEXT as inf_type,
            'Shared connection through: ' || (SELECT full_name FROM people WHERE id = pr2.target_person_id LIMIT 1) as reason
        FROM person_relationships pr1
        JOIN person_relationships pr2 ON pr1.target_person_id = pr2.target_person_id
        JOIN people p ON pr2.source_person_id = p.id
        WHERE pr1.source_person_id = target_id
        AND pr2.source_person_id != target_id
        LIMIT 10
    ),
    semantic_matches AS (
        -- People who appear in semantically similar documents
        SELECT 
            p.id as entity_id,
            p.full_name as name,
            ((1 - (kb.embedding <=> target_vector)) * 100)::FLOAT as score,
            'AI Link Inference'::TEXT as inf_type,
            'Strong semantic correlation in investigative reports.'::TEXT as reason
        FROM ai_knowledge_base kb
        JOIN people p ON kb.content ILIKE '%' || p.full_name || '%'
        WHERE kb.embedding <=> target_vector < 0.25
        AND p.id != target_id
        AND target_vector IS NOT NULL
        LIMIT 10
    )
    SELECT * FROM graph_matches
    UNION ALL
    SELECT * FROM semantic_matches
    ORDER BY score DESC;
END;
$$ LANGUAGE plpgsql;
`;

async function deploy() {
    console.log('Deploying infer_corruption_links RPC...');
    
    // Using a hacky way to run raw SQL since I don't have a direct SQL tool that works yet
    // I'll try to use the 'rpc' method with a dummy or if there is a 'query' RPC.
    // Actually, I can use the Supabase 'apply_migration' tool IF I can get the user to give me the token.
    // BUT I can try to use 'supabase.rpc' to run it if the user has an 'exec_sql' RPC.
    
    // Let's check if 'exec_sql' exists.
    const { data: rpcs, error: rpcError } = await supabase.rpc('get_rpcs' as any);
    console.log('Available RPCs:', rpcs);
    
    // If no exec_sql, I'll provide the SQL to the user.
    console.log('\n--- SQL TO DEPLOY ---\n');
    console.log(sql);
    console.log('\n---------------------\n');
    
    console.log('Action: Please run the above SQL in your Supabase SQL Editor to enable AI Link Inference.');
}

deploy();
