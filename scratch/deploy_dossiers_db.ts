import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function deployDossiersTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS dossiers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_id UUID,
        entity_type TEXT NOT NULL CHECK (entity_type IN ('PERSON', 'ORG')),
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        status TEXT DEFAULT 'PUBLISHED',
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    ALTER TABLE dossiers ENABLE ROW LEVEL SECURITY;

    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to published dossiers') THEN
            CREATE POLICY "Allow public read access to published dossiers" ON dossiers FOR SELECT USING (status = 'PUBLISHED');
        END IF;
    END $$;
    `;

    // Attempting to run SQL via a standard 'exec_sql' RPC if available, 
    // otherwise informing the user.
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });
    
    if (error) {
        console.log("RPC exec_sql not found or failed. Please run this manually in Supabase SQL Editor:\n");
        console.log(sql);
    } else {
        console.log("✅ Dossiers table deployed successfully.");
    }
}

deployDossiersTable();
