import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const filePath = path.join(process.cwd(), 'intelligence', 'extractions', 'gang_incidents_structured.json');
  if (!fs.existsSync(filePath)) {
    console.error("Structured incidents file not found.");
    return;
  }

  const incidents = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Processing ${incidents.length} incidents...`);

  for (const item of incidents) {
    console.log(`\n[${item.title}]`);

    // 1. Handle Syndicate/Org
    let orgId = null;
    if (item.syndicate_link) {
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .upsert({ name: item.syndicate_link, type: 'syndicate' }, { onConflict: 'name' })
        .select('id')
        .single();
      if (org) orgId = org.id;
      if (orgError) console.error("Org Error:", orgError.message);
    }

    // 2. Handle Incident
    let { data: existingInc, error: findError } = await supabase
      .from('incidents')
      .select('id')
      .eq('title', item.title)
      .eq('occurred_at', item.occurred_at)
      .maybeSingle();

    let incidentId;
    if (existingInc) {
      incidentId = existingInc.id;
      // Update existing
      await supabase.from('incidents').update({
        type: item.type,
        location: item.location,
        description: item.description,
        source_url: item.source_url,
        syndicate_link: item.syndicate_link
      }).eq('id', incidentId);
    } else {
      const { data: incident, error: incError } = await supabase
        .from('incidents')
        .insert({
          title: item.title,
          type: item.type,
          occurred_at: item.occurred_at,
          location: item.location,
          description: item.description,
          source_url: item.source_url,
          syndicate_link: item.syndicate_link
        })
        .select('id')
        .single();

      if (incError) {
        console.error("Incident Error:", incError.message);
        continue;
      }
      incidentId = incident.id;
    }

    // 3. Handle People
    for (const person of item.people) {
      // Find or create person
      const { data: existing } = await supabase.from('people').select('id').eq('full_name', person.full_name);
      
      let personId;
      if (!existing || existing.length === 0) {
        const { data: newPerson, error: pError } = await supabase
          .from('people')
          .insert({
            full_name: person.full_name,
            status: person.status,
            risk_score: 85
          })
          .select('id')
          .single();
        if (newPerson) personId = newPerson.id;
      } else {
        personId = existing[0].id;
        // Update status if it changed
        await supabase.from('people').update({ status: person.status }).eq('id', personId);
      }

      if (personId) {
        // Link Person to Incident
        await supabase.from('person_incident_links').upsert({
          person_id: personId,
          incident_id: incidentId,
          role: person.role
        }, { onConflict: 'person_id,incident_id' });

        // Link Person to Org
        if (orgId) {
          await supabase.from('person_org_links').upsert({
            person_id: personId,
            org_id: orgId,
            role: person.role.includes('Boss') ? 'Leader' : 'Operative'
          }, { onConflict: 'person_id,org_id' });
        }
      }
    }
  }

  console.log("\nIngestion complete.");
}

main();
