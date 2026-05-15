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
      source: link.person.id,
      target: link.org.id,
      label: link.role,
      weight: link.confidence / 100
    });
  });

  // Process relationships
  relationships?.forEach((rel: any) => {
    addNode(rel.source_person, "PEP");
    addNode(rel.target_person, "PEP");

    edges.push({
      source: rel.source_person.id,
      target: rel.target_person.id,
      label: rel.relationship_type,
      weight: rel.confidence / 100
    });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges: edges
  };
}

export async function inferLinks(nodeId: string, nodeType: string) {
  const supabase = await createServerClient();
  
  // 1. Fetch source embedding
  const table = nodeType === 'PEP' ? 'people' : 'organizations';
  const { data: source, error: sourceError } = await supabase
    .from(table)
    .select('embedding')
    .eq('id', nodeId)
    .single();

  if (sourceError || !source?.embedding) {
    console.error("Error fetching source embedding or missing embedding:", sourceError);
    return [];
  }

  // 2. Fetch candidates (sample for prototype)
  const { data: candidates, error: candError } = await supabase
    .from(table)
    .select('id, full_name, name, description, risk_score, embedding')
    .not('id', 'eq', nodeId)
    .not('embedding', 'is', null)
    .limit(100);

  if (candError) {
    console.error("Error fetching candidates:", candError);
    return [];
  }

  // 3. Calculate similarity in memory
  return candidates
    .map(c => {
      const sim = cosineSimilarity(source.embedding, c.embedding);
      return {
        id: c.id,
        name: c.full_name || c.name,
        type: nodeType,
        risk: c.risk_score || 50,
        similarity: sim
      };
    })
    .filter(c => c.similarity > 0.85) 
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
}

function cosineSimilarity(vecA: number[], vecB: number[]) {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
}
