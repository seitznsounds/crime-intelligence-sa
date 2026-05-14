import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testInference() {
  console.log('--- Phase 1: Identifying High Risk Hubs ---');
  const { data: hubs, error: hubError } = await supabase
    .from('people')
    .select('id, full_name, risk_score')
    .gt('risk_score', 80)
    .limit(5);

  if (hubError) {
    console.error('Error finding hubs:', hubError.message);
    return;
  }

  console.log('Identified Hubs:', hubs.map(h => `${h.full_name} (${h.risk_score})`));

  for (const hub of hubs) {
    console.log(`\nAnalyzing Hub: ${hub.full_name}`);
    
    // Find 1st degree links
    const { data: links, error: linkError } = await supabase
      .from('person_relationships')
      .select('target_person_id, relationship_type')
      .eq('source_person_id', hub.id);

    if (linkError) continue;

    const associateIds = links.map(l => l.target_person_id);
    console.log(`Found ${associateIds.length} direct associates.`);

    if (associateIds.length > 0) {
      // Inference: Who else is linked to these associates but NOT the hub?
      const { data: inferred, error: inferError } = await supabase
        .from('person_relationships')
        .select('source_person_id, relationship_type')
        .in('target_person_id', associateIds)
        .neq('source_person_id', hub.id);

      if (inferred && inferred.length > 0) {
        console.log(`PREDICTED LINKS for ${hub.full_name}:`);
        for (const inf of inferred) {
           const { data: p } = await supabase.from('people').select('full_name').eq('id', inf.source_person_id).single();
           console.log(` -> Potential indirect link to ${p?.full_name || inf.source_person_id} via shared associates.`);
        }
      } else {
        console.log('No indirect links found via graph analysis.');
      }
    }
  }
}

testInference();
