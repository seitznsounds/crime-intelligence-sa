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

export async function getDeepIntel(entityId: string) {
  try {
    const supabase = await createServerClient();
    
    // 1. Fetch metadata from people/orgs first
    let entityName = "";
    let entityObj: any = null;
    let entityType = 'PERSON';
    
    const { data: person } = await supabase.from('people').select('*').eq('id', entityId).single();
    if (person) {
      entityName = person.full_name;
      entityObj = person;
    } else {
      const { data: org } = await supabase.from('organizations').select('*').eq('id', entityId).single();
      if (org) {
        entityName = org.name;
        entityObj = org;
        entityType = 'ORG';
      }
    }

    if (!entityName) return null;

    // 2. Try to find a DB-stored dossier in historical_records
    const { data: dbDossier } = await supabase
        .from('historical_records')
        .select('content, metadata, source_url')
        .eq('category', 'DOSSIER')
        .or(`metadata->>entity_id.eq.${entityId},title.ilike.%${entityName}%`)
        .maybeSingle();

    // 3. Dynamic Connections
    let connections: any[] = [];
    if (entityType === 'PERSON') {
        const { data: rels } = await supabase.from('person_relationships')
            .select(`relationship_type, confidence, source:source_person_id(id, full_name), target:target_person_id(id, full_name)`)
            .or(`source_person_id.eq.${entityId},target_person_id.eq.${entityId}`);
            
        if (rels) {
            rels.forEach((r: any) => {
                const other = r.source?.id === entityId ? r.target : r.source;
                if (other) {
                    connections.push({
                        name: other.full_name,
                        context: `${r.relationship_type}` + (r.confidence ? ` (${r.confidence}% conf)` : '')
                    });
                }
            });
        }
        
        const { data: orgLinks } = await supabase.from('person_org_links')
            .select(`role, confidence, org:organizations(name)`)
            .eq('person_id', entityId);
            
        if (orgLinks) {
            orgLinks.forEach((l: any) => {
               if (l.org) {
                   connections.push({
                       name: l.org.name,
                       context: `${l.role}` + (l.confidence ? ` (${l.confidence}% conf)` : '')
                   });
               }
            });
        }
    } else {
        const { data: personLinks } = await supabase.from('person_org_links')
            .select(`role, confidence, person:people(full_name)`)
            .eq('org_id', entityId);
            
        if (personLinks) {
            personLinks.forEach((l: any) => {
                if (l.person) {
                    connections.push({
                        name: l.person.full_name,
                        context: `${l.role}` + (l.confidence ? ` (${l.confidence}% conf)` : '')
                    });
                }
            });
        }
    }
    
    // Deduplicate connections
    connections = connections.filter((conn, index, self) => 
      index === self.findIndex((c) => c.name === conn.name)
    );

    // 4. Dynamic Timeline and Incidents
    const timeline: any[] = [];
    const sourceSet = new Set<string>();
    
    if (entityObj.source_file) sourceSet.add(entityObj.source_file);
    if (entityObj.verification_source) sourceSet.add(entityObj.verification_source);
    if (entityObj.metadata?.source) sourceSet.add(entityObj.metadata.source);
    if (entityObj.metadata?.original_source) sourceSet.add(entityObj.metadata.original_source);
    if (dbDossier?.source_url) sourceSet.add(dbDossier.source_url);
    if (dbDossier?.metadata?.source) sourceSet.add(dbDossier.metadata.source);

    if (entityType === 'PERSON') {
        const { data: incidentLinks } = await supabase.from('person_incident_links')
            .select(`role, incident:incidents(id, title, summary, occurred_at, source_name, source_url)`)
            .eq('person_id', entityId);
            
        if (incidentLinks) {
            incidentLinks.forEach((l: any) => {
                if (l.incident) {
                    if (l.incident.source_name) sourceSet.add(l.incident.source_name);
                    if (l.incident.source_url) sourceSet.add(l.incident.source_url);
                    
                    if (l.incident.occurred_at) {
                        timeline.push({
                            year: new Date(l.incident.occurred_at).getFullYear(),
                            title: l.incident.title,
                            description: l.incident.summary || `Implicated as ${l.role || 'participant'}.`
                        });
                    }
                }
            });
        }
    }
    
    timeline.sort((a, b) => b.year - a.year);
    
    if (timeline.length === 0 && entityObj.metadata?.timeline && Array.isArray(entityObj.metadata.timeline)) {
        timeline.push(...entityObj.metadata.timeline);
    }
    
    const sources = Array.from(sourceSet).filter(Boolean);
    if (sources.length === 0) {
        sources.push("Investigative Data Repository");
    }

    // 5. Dynamic Narrative
    let narrative = dbDossier?.metadata?.narrative || entityObj.metadata?.narrative;
    
    if (!narrative || (Array.isArray(narrative) && narrative.length === 0)) {
        narrative = [
            `Intelligence profile for ${entityName}.`,
            entityObj.description ? `Entity Description: ${entityObj.description}` : `Classified as ${entityObj.role || 'an operative'} within the monitored network.`,
            entityObj.status ? `Current status indicates they are ${entityObj.status}.` : "Status is currently subject to ongoing verification.",
            `Calculated Risk Exposure: ${entityObj.risk_score || 50}%.`
        ].filter(Boolean);
    }

    const summary = dbDossier?.metadata?.description || entityObj.description || entityObj.metadata?.description || `High-priority intelligence subject: ${entityName}.`;
    
    return {
      summary,
      narrative,
      connections,
      status: entityObj.status || ((entityObj.risk_score || 0) > 80 ? "CRITICAL RISK" : "UNDER INVESTIGATION"),
      timeline,
      dossier: dbDossier?.content || null,
      sources
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

