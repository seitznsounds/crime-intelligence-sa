import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testActionsLogic() {
  const { data: orgs, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("type", "syndicate");

  if (orgError) throw new Error(orgError.message);

  const syndicates = await Promise.all(orgs.map(async (org: any) => {
    const { data: links } = await supabase
      .from("person_org_links")
      .select("*, people(*)")
      .eq("org_id", org.id);

    const members = links?.map((l: any) => ({
      id: l.people.id,
      name: l.people.full_name,
      role: l.role,
      type: l.people.role || "OPERATIVE",
      risk: l.people.risk_score ? (l.people.risk_score > 10 ? l.people.risk_score : l.people.risk_score * 10) : 50,
      desc: l.people.description
    })) || [];

    const boss = members.find(m => m.role.toLowerCase().includes('boss'));
    
    // Find associates for the boss
    let children: any[] = [];
    if (boss) {
      const { data: rels } = await supabase
        .from('person_relationships')
        .select('*, source_person:source_person_id(*)')
        .eq('target_person_id', boss.id);
      
      children = rels?.map((r: any) => ({
        id: r.source_person.id,
        name: r.source_person.full_name,
        role: r.relationship_type.toUpperCase(),
        type: r.source_person.role || "ASSOCIATE",
        risk: r.source_person.risk_score ? (r.source_person.risk_score > 10 ? r.source_person.risk_score : r.source_person.risk_score * 10) : 80,
        desc: r.source_person.description || r.evidence_summary
      })) || [];
    }

    return {
      id: org.id,
      name: org.name,
      origin: org.headquarters || "Unknown Origin",
      focus: org.sector || "Organized Crime",
      hierarchy: boss ? {
        ...boss,
        children: children
      } : (members[0] ? { ...members[0], children: [] } : null)
    };
  }));

  console.log(JSON.stringify(syndicates, null, 2));
}
testActionsLogic();