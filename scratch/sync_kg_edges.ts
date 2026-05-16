import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getAllFromTable(tableName: string, columns: string) {
    let allItems: any[] = [];
    let from = 0;
    let to = 999;
    let finished = false;

    while (!finished) {
        const { data, error } = await supabase
            .from(tableName)
            .select(columns)
            .range(from, to);

        if (error) break;
        if (data && data.length > 0) {
            allItems = allItems.concat(data);
            from += 1000;
            to += 1000;
        } else {
            finished = true;
        }
    }
    return allItems;
}

const ALLOWED_RELATIONSHIPS = ['associate', 'financier', 'handler', 'subordinate'];

function sanitizeRelationship(rel: string): string {
    const lower = rel?.toLowerCase() || 'associate';
    if (ALLOWED_RELATIONSHIPS.includes(lower)) return lower;
    if (lower.includes('fund') || lower.includes('pay') || lower.includes('invest')) return 'financier';
    if (lower.includes('boss') || lower.includes('leader') || lower.includes('manage')) return 'handler';
    if (lower.includes('member') || lower.includes('operative') || lower.includes('work')) return 'subordinate';
    return 'associate';
}

async function main() {
  const filePath = path.join(process.cwd(), 'intelligence', 'corruption_knowledge_graph.json');
  if (!fs.existsSync(filePath)) return;

  const kg = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Final Edge Sync: Processing ${kg.edges.length} Edges...`);

  const allPeople = await getAllFromTable('people', 'id, full_name');
  const allOrgs = await getAllFromTable('organizations', 'id, name');

  const personMap = new Map();
  allPeople.forEach(p => personMap.set(p.full_name, p.id));

  const orgMap = new Map();
  allOrgs.forEach(o => orgMap.set(o.name, o.id));

  console.log(`Cached ${personMap.size} people and ${orgMap.size} organizations.`);

  const nodesMap = new Map();
  kg.nodes.forEach((n: any) => nodesMap.set(n.id, n));

  const personOrgLinks = [];
  const personPersonLinks = [];

  for (const edge of kg.edges) {
    const sourceNode = nodesMap.get(edge.source);
    const targetNode = nodesMap.get(edge.target);

    if (!sourceNode || !targetNode) continue;

    if (sourceNode.type === 'Person' && targetNode.type === 'Organization') {
      const pId = personMap.get(sourceNode.name);
      const oId = orgMap.get(targetNode.name);
      if (pId && oId) {
        personOrgLinks.push({
          person_id: pId,
          org_id: oId,
          role: edge.relationship || 'Operative',
          metadata: { context: edge.description, source: 'Master KG Sync' }
        });
      }
    }

    if (sourceNode.type === 'Person' && targetNode.type === 'Person') {
      const p1Id = personMap.get(sourceNode.name);
      const p2Id = personMap.get(targetNode.name);
      if (p1Id && p2Id) {
        personPersonLinks.push({
          source_person_id: p1Id,
          target_person_id: p2Id,
          relationship_type: sanitizeRelationship(edge.relationship),
          evidence_summary: edge.description
        });
      }
    }
  }

  console.log(`Prepared ${personOrgLinks.length} Person-Org Links and ${personPersonLinks.length} Person-Person Relationships.`);

  if (personOrgLinks.length > 0) {
    console.log("Upserting Person-Org Links...");
    for (let i = 0; i < personOrgLinks.length; i += 100) {
      await supabase.from('person_org_links').upsert(personOrgLinks.slice(i, i + 100), { onConflict: 'person_id,org_id' });
      process.stdout.write(`.`);
    }
  }

  if (personPersonLinks.length > 0) {
    console.log("\nupserting Person-Person Relationships...");
    for (let i = 0; i < personPersonLinks.length; i += 100) {
      await supabase.from('person_relationships').upsert(personPersonLinks.slice(i, i + 100), { onConflict: 'source_person_id,target_person_id' });
      process.stdout.write(`.`);
    }
  }

  console.log(`\nFinal Sync Complete.`);
}

main();
