import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const filePath = path.join(process.cwd(), 'intelligence', 'corruption_knowledge_graph.json');
  if (!fs.existsSync(filePath)) {
    console.error("Master Knowledge Graph file not found.");
    return;
  }

  const kg = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Starting Master Sync: ${kg.nodes.length} nodes, ${kg.edges.length} edges...`);

  // 1. Separate nodes by type
  const orgNodes = kg.nodes.filter((n: any) => n.type === 'Organization');
  const personNodes = kg.nodes.filter((n: any) => n.type === 'Person');
  const eventNodes = kg.nodes.filter((n: any) => n.type === 'Event');

  // 2. Batch process Organizations
  console.log(`Processing ${orgNodes.length} Organizations...`);
  for (let i = 0; i < orgNodes.length; i += 50) {
    const batch = orgNodes.slice(i, i + 50).map((node: any) => ({
      name: node.name,
      type: 'syndicate',
      description: node.metadata?.description || "",
      risk_score: node.metadata?.risk_score || 50,
      metadata: node.metadata
    }));
    const { error } = await supabase.from('organizations').upsert(batch, { onConflict: 'name' });
    if (error) console.error(`Org Batch ${i} Error:`, error.message);
  }

  // 3. Batch process People
  console.log(`Processing ${personNodes.length} People...`);
  for (let i = 0; i < personNodes.length; i += 50) {
    const batch = personNodes.slice(i, i + 50).map((node: any) => ({
      full_name: node.name,
      description: node.metadata?.description || "",
      metadata: node.metadata,
      risk_score: node.metadata?.risk_score || 75 // Default for forensic entities
    }));
    // Note: people table has unique constraint on id, but not necessarily name. 
    // We'll use a manual upsert pattern or handle name conflicts if they exist.
    for (const p of batch) {
       const { data: existing } = await supabase.from('people').select('id').eq('full_name', p.full_name).maybeSingle();
       if (existing) {
         await supabase.from('people').update(p).eq('id', existing.id);
       } else {
         await supabase.from('people').insert(p);
       }
    }
    process.stdout.write(`.`);
  }
  console.log("\nPeople processed.");

  // 4. Batch process Edges (Forensic Links)
  console.log(`Processing ${kg.edges.length} Edges...`);
  // This requires mapping node IDs to DB IDs. 
  // For efficiency in a script this size, we'll cache common IDs.
  
  for (const edge of kg.edges) {
    const sourceNode = kg.nodes.find((n: any) => n.id === edge.source);
    const targetNode = kg.nodes.find((n: any) => n.id === edge.target);

    if (!sourceNode || !targetNode) continue;

    // Person -> Org Links
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

    // Person -> Person Relationships
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

  console.log("Master Synchronization Complete.");
}

main().catch(err => {
  console.error("Main execution error:", err);
  process.exit(1);
});
