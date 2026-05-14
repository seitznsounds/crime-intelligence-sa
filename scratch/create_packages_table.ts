import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTable() {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.evidence_packages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          recipient TEXT NOT NULL,
          classification TEXT DEFAULT 'SECRET',
          status TEXT DEFAULT 'DRAFT',
          content JSONB NOT NULL,
          signature TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
      ALTER TABLE public.evidence_packages ENABLE ROW LEVEL SECURITY;
      -- Drop if exists to avoid error on rerun
      DROP POLICY IF EXISTS "Public read access" ON public.evidence_packages;
      CREATE POLICY "Public read access" ON public.evidence_packages FOR SELECT USING (true);
    `
  });

  if (error) {
    console.error('Error creating table:', error.message);
  } else {
    console.log('Table created or verified.');
  }
}

createTable();
