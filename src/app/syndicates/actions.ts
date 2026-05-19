"use server";

import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function getSyndicates() {
  let supabase;
  try {
    supabase = await createServerClient();
  } catch (e) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  const { data: orgs, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .or("type.eq.syndicate,type.eq.Syndicate");

  if (orgError) throw new Error(orgError.message);

  const syndicates = await Promise.all(orgs.map(async (org: any) => {
    // 1. Fetch people linked directly to this organization
    const { data: links } = await supabase
      .from("person_org_links")
      .select("*, people(*)")
      .eq("org_id", org.id);

    let members = links?.map((l: any) => ({
      id: l.people.id,
      name: l.people.full_name,
      role: l.role || "OPERATIVE",
      type: l.people.role || "OPERATIVE",
      risk: l.people.risk_score ? (l.people.risk_score > 10 ? l.people.risk_score : l.people.risk_score * 10) : 50,
      desc: l.people.description
    })) || [];

    // 2. Fetch people mentioned in historical records (judgments) linked to this org
    // This is a new data source we just ingested
    const { data: records } = await supabase
        .from('historical_records')
        .select('metadata')
        .eq('category', 'COURT_JUDGMENT')
        .ilike('title', `%${org.name}%`);

    if (records) {
        records.forEach(r => {
            const defendant = r.metadata?.['Applicant / Plaintiff'] || r.metadata?.['Appellant'];
            if (defendant && typeof defendant === 'string' && !members.some(m => m.name === defendant)) {
                members.push({
                    id: `def-${defendant.toLowerCase().replace(/\s+/g, '-')}`,
                    name: defendant,
                    role: "DEFENDANT",
                    type: "LEGAL_PARTY",
                    risk: 85,
                    desc: "Identified in linked court judgment."
                });
            }
        });
    }

    let boss = members.find(m => m.role.toLowerCase().includes('boss') || m.role.toLowerCase().includes('leader') || m.role.toLowerCase().includes('founder') || m.role.toLowerCase().includes('president'));
    
    // Find associates or component links
    let children: any[] = [];
    if (boss) {
      // For organizations like Numbers Gang, we might have sub-orgs as children
      const { data: subOrgs } = await supabase
        .from('organizations')
        .select('*')
        .eq('status', 'active'); // Mock filter or use a link table

      if (org.name.includes('Numbers Gang')) {
        // Special case for Numbers Gang to show 26, 27, 28
        const subGangs = orgs.filter(o => ['The 26s', 'The 27s', 'The 28s'].includes(o.name));
        children = subGangs.map(sg => ({
          id: sg.id,
          name: sg.name,
          role: 'COMPONENT GANG',
          type: 'SYNDICATE',
          risk: sg.risk_score || 90,
          desc: sg.description,
          children: []
        }));
      } else {
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
    }

    return {
      id: org.id,
      name: org.name,
      origin: org.headquarters || "Western Cape Prisons / Johannesburg",
      focus: org.sector || "Organized Crime",
      description: org.description,
      hierarchy: boss ? {
        ...boss,
        children: children
      } : (members[0] ? { ...members[0], children: [] } : null)
    };
  }));

  return syndicates;
}
