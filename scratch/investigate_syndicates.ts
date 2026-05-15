import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function investigateSyndicates() {
  console.log("--- ORGANIZATIONS ---");
  const { data: orgs, error: orgErr } = await supabase.from('organizations').select('*').ilike('name', '%mafia%');
  console.log("Mafia orgs:", orgs?.map(o => ({ id: o.id, name: o.name, type: o.type })));

  const { data: syns, error: synErr } = await supabase.from('organizations').select('*').eq('type', 'syndicate');
  console.log("Syndicate orgs:", syns?.map(o => ({ id: o.id, name: o.name, type: o.type })));

  console.log("\n--- PERSON ORG LINKS FOR SYNDICATES ---");
  if (syns) {
    for (const syn of syns) {
      const { data: links } = await supabase.from('person_org_links').select('role, people(full_name)').eq('org_id', syn.id);
      console.log(`Links for ${syn.name}:`, links);
    }
  }

  // Let's also check if they are just mentioned in knowledge base
  console.log("\n--- KNOWLEDGE BASE MENTIONS ---");
  const { data: kbGold } = await supabase.from('ai_knowledge_base').select('id, title').ilike('content', '%gold mafia%');
  console.log(`Gold Mafia KB hits:`, kbGold?.length);

  const { data: kbTaxi } = await supabase.from('ai_knowledge_base').select('id, title').ilike('content', '%taxi mafia%');
  console.log(`Taxi Mafia KB hits:`, kbTaxi?.length);
}

investigateSyndicates();
