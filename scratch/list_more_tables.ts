import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAllTables() {
  const { data, error } = await supabase
    .rpc('get_tables'); // Assuming there's a RPC or I can query information_schema

  if (error) {
    // If RPC fails, try querying information_schema directly if possible via execute_sql equivalent
    // But since I don't have execute_sql working yet, I'll try a common query
    const { data: tables, error: tableError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tableError) {
      console.error('Error listing tables:', tableError);
      return;
    }
    console.log('Tables:', tables.map(t => t.tablename));
  } else {
    console.log('Tables:', data);
  }
}

// Alternative approach: check common table names
async function listTablesAlternative() {
    const { data, error } = await supabase.rpc('get_schema_info');
    if (error) {
        // Try raw SQL if allowed via query
        const { data: qData, error: qError } = await supabase.from('_metadata' as any).select('*').limit(1); 
        // Just a hack to see if we can get something
    }
}

async function listTablesProperly() {
    // Using the Postgres information_schema via a dummy from call might not work.
    // Let's just try to query information_schema.tables if it's exposed (usually it's not via PostgREST).
    
    // Actually, I'll just use the audit-data.ts as a starting point and add more likely names.
    const potentialTables = [
        'provinces', 'stations', 'crime_categories', 'person_incident_links',
        'person_org_links', 'person_relationships', 'org_links', 'evidence_sources',
        'zondo_pillars', 'legislative_gaps', 'reporting_metrics', 'social_norm_metrics',
        'victims', 'amnesty_applications', 'locations'
    ];
    
    for (const table of potentialTables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (!error) {
            console.log(`- ${table.padEnd(30)}: ${count} rows`);
        }
    }
}

listTablesProperly();
