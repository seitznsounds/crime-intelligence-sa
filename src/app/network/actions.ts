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
    
    // First try to find the entity name from supabase
    let entityName = "";
    const { data: person } = await supabase.from('people').select('full_name').eq('id', entityId).single();
    if (person) {
      entityName = person.full_name;
    } else {
      const { data: org } = await supabase.from('organizations').select('name').eq('id', entityId).single();
      if (org) entityName = org.name;
    }

    if (!entityName) return null;

    // Load the JSON graph
    const filePath = path.join(process.cwd(), 'intelligence', 'corruption_knowledge_graph.json');
    if (!fs.existsSync(filePath)) return null;
    
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const graph = JSON.parse(fileData);

    // Try to match node
    const node = graph.nodes.find((n: any) => 
      n.name.toLowerCase().includes(entityName.toLowerCase()) || 
      entityName.toLowerCase().includes(n.name.toLowerCase()) ||
      n.id === entityId
    );

    if (!node) {
      return {
        summary: `No classified dossier found for ${entityName}. Entity profile relies on baseline heuristics.`,
        narrative: ["Profile data is currently limited to structural nodes. Deep intelligence extraction is pending."],
        status: "ACTIVE"
      };
    }

    // Check for a published dossier file
    let fullDossier = null;
    const dossierPath = path.join(process.cwd(), 'intelligence', 'dossiers', `${node.id}.md`);
    if (fs.existsSync(dossierPath)) {
      fullDossier = fs.readFileSync(dossierPath, 'utf-8');
    }

    // Find connections in the JSON
    const connections = graph.edges
      .filter((e: any) => e.source === node.id || e.target === node.id)
      .map((e: any) => {
        const otherId = e.source === node.id ? e.target : e.source;
        const otherNode = graph.nodes.find((n: any) => n.id === otherId);
        return {
          name: otherNode ? otherNode.name : otherId,
          context: `${e.relationship}: ${e.description}`
        };
      });

    // Mock a timeline based on relationships or specific hardcoded events from INGEST.md
    const timeline = [];
    if (node.id === 'cat-matlala') {
       timeline.push({ year: 2021, title: "Deokaran Assassination", description: "Whistleblower killed after exposing irregular contracts linked to Matlala.", isKey: true });
       timeline.push({ year: 2024, title: "SAPS Contract", description: "Medicare 24 awarded R360m health-services contract." });
       timeline.push({ year: 2025, title: "Arrest", description: "Arrested for attempted murder, fraud, and illicit firearms.", isKey: true });
    } else if (node.id === 'katiso-molefe') {
       timeline.push({ year: 2022, title: "DJ Sumbody Murder", description: "Allegedly masterminded the killing of DJ Sumbody.", isKey: true });
       timeline.push({ year: 2025, title: "Arrest & Bail", description: "Arrested in August, released on controversial R400k bail in October." });
    }

    return {
      summary: node.metadata?.description || "High-priority intelligence subject.",
      narrative: node.metadata?.narrative || [
        "Intelligence indicates this entity is deeply embedded in the systemic capture network.",
        "Further operational details are subject to ongoing Madlanga Commission investigations."
      ],
      connections: connections,
      status: node.risk_score > 90 ? "CRITICAL RISK" : "UNDER INVESTIGATION",
      timeline: timeline,
      dossier: fullDossier,
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

