import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const graphPath = "intelligence/corruption_knowledge_graph.json";

async function linkJudgmentsToGraph() {
  console.log("Loading knowledge graph...");
  const graph = JSON.parse(fs.readFileSync(graphPath, "utf8"));
  
  console.log("Fetching recent court judgments...");
  const { data: judgments, error } = await supabase
    .from('historical_records')
    .select('id, title, metadata, summary, category')
    .eq('category', 'COURT_JUDGMENT')
    .limit(50);

  if (error || !judgments) {
    console.error("Error fetching judgments:", error);
    return;
  }

  const existingNodeIds = new Set(graph.nodes.map((n: any) => n.id));
  let nodesAdded = 0;
  let edgesAdded = 0;

  for (const j of judgments) {
    const caseId = `case-${j.id.substring(0, 8)}`;
    
    // Add Judgment Node
    if (!existingNodeIds.has(caseId)) {
      graph.nodes.push({
        id: caseId,
        type: "Event",
        name: j.title.split(' (')[0], // Clean title
        metadata: {
          description: j.summary,
          case_number: j.metadata?.['Case Number'],
          court: j.metadata?.['Court'],
          category: "Legal"
        }
      });
      existingNodeIds.add(caseId);
      nodesAdded++;
    }

    // Link Judges
    const judges = j.metadata?.['Judge(s)'] || j.metadata?.['Judges'];
    if (judges) {
      const judgeList = Array.isArray(judges) ? judges : [judges];
      for (const judgeName of judgeList) {
        const judgeId = judgeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        if (!existingNodeIds.has(judgeId)) {
          graph.nodes.push({
            id: judgeId,
            type: "Person",
            name: judgeName,
            metadata: { roles: ["Judge"], status: "Official" }
          });
          existingNodeIds.add(judgeId);
          nodesAdded++;
        }

        graph.edges.push({
          source: judgeId,
          target: caseId,
          relationship: "PresidedOver",
          description: "Presided over the court proceedings."
        });
        edgesAdded++;
      }
    }

    // Link Defendants/Appellants
    const defendant = j.metadata?.['Applicant / Plaintiff'] || j.metadata?.['Appellant'];
    if (defendant && typeof defendant === 'string') {
        const defId = defendant.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (!existingNodeIds.has(defId)) {
            graph.nodes.push({
                id: defId,
                type: "Entity",
                name: defendant,
                metadata: { category: "Legal Party" }
            });
            existingNodeIds.add(defId);
            nodesAdded++;
        }

        graph.edges.push({
            source: defId,
            target: caseId,
            relationship: "InvolvedIn",
            description: "Party to the legal case."
        });
        edgesAdded++;
    }
  }

  console.log(`Knowledge Graph Updated: +${nodesAdded} Nodes, +${edgesAdded} Edges.`);
  fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2), "utf8");
}

linkJudgmentsToGraph().catch(console.error);
