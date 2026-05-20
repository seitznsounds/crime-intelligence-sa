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

  // 3. Process Inferred Connections from Organization Metadata
  const { data: orgsWithInferred } = await supabase
    .from('organizations')
    .select('id, metadata')
    .not('metadata->inferred_connections', 'is', null);

  orgsWithInferred?.forEach(org => {
    const inferred = org.metadata.inferred_connections;
    if (Array.isArray(inferred)) {
        inferred.forEach((link: any) => {
            // Only add if both nodes are likely in the graph already (to avoid dangling edges)
            // Or add the target node if missing
            edges.push({
                source: org.id,
                target: link.target,
                label: link.type,
                weight: (link.confidence || 60) / 100,
                isInferred: true
            });
        });
    }
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

import fs from 'fs';
import path from 'path';

export async function getDeepIntel(entityId: string) {
  try {
    const supabase = await createServerClient();
    
    // 1. Fetch metadata from people/orgs first
    let entityName = "";
    const { data: person } = await supabase.from('people').select('full_name').eq('id', entityId).single();
    if (person) {
      entityName = person.full_name;
    } else {
      const { data: org } = await supabase.from('organizations').select('name').eq('id', entityId).single();
      if (org) entityName = org.name;
    }

    if (!entityName) return null;

    // 2. Try to find a DB-stored dossier in historical_records
    const { data: dbDossier } = await supabase
        .from('historical_records')
        .select('content, metadata')
        .eq('category', 'DOSSIER')
        .or(`metadata->>entity_id.eq.${entityId},title.ilike.%${entityName}%`)
        .maybeSingle();

    // 3. Fallback to Graph if needed
    const filePath = path.join(process.cwd(), 'intelligence', 'corruption_knowledge_graph.json');
    let graphNode: any = null;
    let connections: any[] = [];

    if (fs.existsSync(filePath)) {
        const graph = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        graphNode = graph.nodes.find((n: any) => n.id === entityId || n.name.toLowerCase().includes(entityName.toLowerCase()));
        
        if (graphNode) {
            connections = graph.edges
                .filter((e: any) => e.source === graphNode.id || e.target === graphNode.id)
                .map((e: any) => {
                    const otherId = e.source === graphNode.id ? e.target : e.source;
                    const otherNode = graph.nodes.find((n: any) => n.id === otherId);
                    return {
                        name: otherNode ? otherNode.name : otherId,
                        context: `${e.relationship}: ${e.description}`
                    };
                });
        }
    }

    // Determine timeline (Mock or dynamic)
    const timeline = [];
    if (entityId === 'cat-matlala' || entityName.includes('Matlala')) {
       timeline.push({ year: 2021, title: "Deokaran Assassination", description: "Whistleblower killed after exposing irregular contracts linked to Matlala.", isKey: true });
       timeline.push({ year: 2024, title: "SAPS Contract", description: "Medicare 24 awarded R360m health-services contract." });
       timeline.push({ year: 2025, title: "Arrest", description: "Arrested for attempted murder, fraud, and illicit firearms.", isKey: true });
    }

    return {
      summary: dbDossier?.metadata?.description || graphNode?.metadata?.description || "High-priority intelligence subject.",
      narrative: dbDossier?.metadata?.narrative || graphNode?.metadata?.narrative || [
        "Intelligence indicates this entity is deeply embedded in the systemic capture network.",
        "Further operational details are subject to ongoing Madlanga Commission investigations."
      ],
      connections: connections,
      status: (graphNode?.risk_score || 0) > 90 ? "CRITICAL RISK" : "UNDER INVESTIGATION",
      timeline: timeline,
      dossier: dbDossier?.content || null,
      sources: [
        "Madlanga Commission Interim Reports",
        "Crime Intelligence Unit Transcripts",
        "Investigative Extractions (2025-2026)"
      ]
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

