import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const graphPath = "intelligence/corruption_knowledge_graph.json";

async function reconstructSyndicates() {
  console.log("Reconstructing Syndicate Hierarchy from Knowledge Graph...");
  
  if (!fs.existsSync(graphPath)) return;
  const graph = JSON.parse(fs.readFileSync(graphPath, "utf8"));

  const organizations = graph.nodes.filter((n: any) => n.type === 'Organization' || (n.type === 'Entity' && n.metadata?.category === 'Legal Party'));
  
  console.log(`Processing ${organizations.length} potential syndicate nodes...`);

  for (const org of organizations) {
    const { data: existing } = await supabase.from('organizations').select('id').eq('name', org.name).maybeSingle();
    
    if (existing) continue;

    // Calculate risk score based on edges
    const connections = graph.edges.filter((e: any) => e.source === org.id || e.target === org.id);
    const riskScore = Math.min(100, connections.length * 10);

    console.log(`  -> Ingesting Syndicate: ${org.name} (Risk: ${riskScore})`);
    
    await supabase.from('organizations').insert({
        name: org.name,
        type: org.type === 'Organization' ? 'Syndicate' : 'Legal Entity',
        risk_score: riskScore,
        description: org.metadata?.description || `Involved in ${connections.length} linked forensic events.`,
        metadata: { ...org.metadata, graph_id: org.id }
    });
  }

  console.log("\nReconstruction Finished.");
}

reconstructSyndicates().catch(console.error);
