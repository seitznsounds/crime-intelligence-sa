import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const filePath = path.join(process.cwd(), 'intelligence', 'gangs_knowledge_graph.json');
  if (!fs.existsSync(filePath)) {
    console.error("Gangs KG file not found.");
    return;
  }

  const kg = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Processing ${kg.nodes.length} nodes and ${kg.edges.length} edges...`);

  // 1. Ingest Nodes (Organizations & People)
  const orgNodes = kg.nodes.filter((n: any) => n.type === 'Organization');
  const personNodes = kg.nodes.filter((n: any) => n.type === 'Person');

  for (const node of orgNodes) {
    const { error } = await supabase.from('organizations').upsert({
      name: node.name,
      type: 'syndicate',
      description: node.metadata?.description || "",
      metadata: node.metadata
    }, { onConflict: 'name' });
    if (error) console.error(`Error upserting org ${node.name}:`, error.message);
  }
  console.log("Organizations upserted.");

  for (const node of personNodes) {
    // Check if exists first to avoid conflict on non-unique constraint
    const { data: existing } = await supabase.from('people').select('id').eq('full_name', node.name);
    if (!existing || existing.length === 0) {
      const { error } = await supabase.from('people').insert({
        full_name: node.name,
        role: node.metadata?.key_attributes?.role || "OPERATIVE",
        description: node.metadata?.description || "",
        metadata: node.metadata,
        risk_score: 85 // Default high risk for identified gang members
      });
      if (error) console.error(`Error inserting person ${node.name}:`, error.message);
    } else {
      // Update metadata
      const { error } = await supabase.from('people').update({
        metadata: node.metadata,
        description: node.metadata?.description || ""
      }).eq('full_name', node.name);
      if (error) console.error(`Error updating person ${node.name}:`, error.message);
    }
  }
  console.log("People processed.");

  // 2. Ingest Edges (Links)
  // We need to fetch IDs for source and target first.
  // This can be complex for all types. Let's start with person-org and person-person.
  
  for (const edge of kg.edges) {
    const sourceNode = kg.nodes.find((n: any) => n.id === edge.source);
    const targetNode = kg.nodes.find((n: any) => n.id === edge.target);

    if (!sourceNode || !targetNode) continue;

    // Handle Person -> Org (Directorship, Affiliation, Leadership)
    if (sourceNode.type === 'Person' && targetNode.type === 'Organization') {
      const { data: p } = await supabase.from('people').select('id').eq('full_name', sourceNode.name).single();
      const { data: o } = await supabase.from('organizations').select('id').eq('name', targetNode.name).single();
      if (p && o) {
        await supabase.from('person_org_links').upsert({
          person_id: p.id,
          org_id: o.id,
          role: edge.relationship,
          metadata: { context: edge.description }
        }, { onConflict: 'person_id,org_id' });
      }
    }
    
    // Handle Person -> Person (Relationship)
    if (sourceNode.type === 'Person' && targetNode.type === 'Person') {
       const { data: p1 } = await supabase.from('people').select('id').eq('full_name', sourceNode.name).single();
       const { data: p2 } = await supabase.from('people').select('id').eq('full_name', targetNode.name).single();
       if (p1 && p2) {
         await supabase.from('person_relationships').upsert({
           source_person_id: p1.id,
           target_person_id: p2.id,
           relationship_type: edge.relationship,
           evidence_summary: edge.description
         }, { onConflict: 'source_person_id,target_person_id' });
       }
    }
  }
  console.log("Edges processed.");
  console.log("Ingestion complete.");
}

main();
