"use server";

import { createServerClient } from "@/lib/supabase-server";

export async function getNetworkData() {
  const supabase = await createServerClient();

  // 1. Fetch all person-org links
  const { data: links, error: linksError } = await supabase
    .from('person_org_links')
    .select(`
      id,
      role,
      confidence,
      source,
      person:people(id, full_name, risk_score, pep_tier),
      org:organizations(id, name, risk_score, type)
    `);

  if (linksError) {
    console.error("Error fetching network links:", linksError);
    return { nodes: [], edges: [] };
  }

  // 2. Fetch all person-person relationships
  const { data: relationships, error: relError } = await supabase
    .from('person_relationships')
    .select(`
      id,
      relationship_type,
      confidence,
      source_person:people!source_person_id(id, full_name, risk_score, pep_tier),
      target_person:people!target_person_id(id, full_name, risk_score, pep_tier)
    `);

  const nodesMap = new Map();
  const edges: any[] = [];

  // Helper to add nodes
  const addNode = (entity: any, type: string) => {
    if (!entity || nodesMap.has(entity.id)) return;
    
    let color = "var(--accent-blue)";
    if (type === "PEP") color = "var(--accent-gold)";
    if (entity.type === "syndicate") color = "var(--accent-crimson)";

    nodesMap.set(entity.id, {
      id: entity.id,
      name: entity.full_name || entity.name,
      type: type,
      risk: entity.risk_score || (entity.pep_tier === 1 ? 95 : entity.pep_tier === 2 ? 75 : 50),
      color: color,
      // Initial positions will be set by the layout algorithm
      x: Math.random() * 800,
      y: Math.random() * 600
    });
  };

  // Process links
  links?.forEach((link: any) => {
    addNode(link.person, "PEP");
    addNode(link.org, "ORG");

    edges.push({
      from: link.person.id,
      to: link.org.id,
      label: link.role,
      weight: link.confidence / 100
    });
  });

  // Process relationships
  relationships?.forEach((rel: any) => {
    addNode(rel.source_person, "PEP");
    addNode(rel.target_person, "PEP");

    edges.push({
      from: rel.source_person.id,
      to: rel.target_person.id,
      label: rel.relationship_type,
      weight: rel.confidence / 100
    });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges: edges
  };
}
