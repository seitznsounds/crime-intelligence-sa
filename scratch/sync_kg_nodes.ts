import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getAllPeople() {
    let allPeople: any[] = [];
    let from = 0;
    let to = 999;
    let finished = false;

    while (!finished) {
        const { data, error } = await supabase
            .from('people')
            .select('id, full_name')
            .range(from, to);

        if (error) break;
        if (data && data.length > 0) {
            allPeople = allPeople.concat(data);
            from += 1000;
            to += 1000;
        } else {
            finished = true;
        }
    }
    return allPeople;
}

async function main() {
  const filePath = path.join(process.cwd(), 'intelligence', 'corruption_knowledge_graph.json');
  if (!fs.existsSync(filePath)) return;

  const kg = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const orgNodes = kg.nodes.filter((n: any) => n.type === 'Organization');
  const personNodes = kg.nodes.filter((n: any) => n.type === 'Person');

  // 1. Organizations
  for (let i = 0; i < orgNodes.length; i += 50) {
    const batch = orgNodes.slice(i, i + 50).map((node: any) => ({
      name: node.name,
      type: 'syndicate',
      status: 'active',
      description: node.metadata?.description || "",
      risk_score: node.metadata?.risk_score || 80,
      metadata: { ...node.metadata, forensic_id: node.id }
    }));
    await supabase.from('organizations').upsert(batch, { onConflict: 'name' });
  }

  const allPeople = await getAllPeople();
  const personMap = new Map();
  // Store both ID and current status
  allPeople.forEach(p => personMap.set(p.full_name, { id: p.id, status: p.status }));
  console.log(`Cached ${personMap.size} unique people.`);

  console.log(`Syncing ${personNodes.length} high-fidelity People...`);
  const toUpdate: any[] = [];
  const toInsert: any[] = [];

  for (const node of personNodes) {
    const existing = personMap.get(node.name);
    
    // Only set 'active' if there's no existing status or if it's currently null
    const finalStatus = (existing?.status && existing.status !== 'active') 
      ? existing.status 
      : 'active';

    const payload: any = {
      full_name: node.name,
      description: node.metadata?.description || "",
      status: finalStatus,
      risk_score: node.metadata?.risk_score || 85,
      metadata: { ...node.metadata, forensic_id: node.id }
    };
    
    // Maintain is_deceased flag if status is Deceased
    if (finalStatus === 'Deceased') {
        payload.is_deceased = true;
    }

    if (existing) {
      toUpdate.push({ id: existing.id, ...payload });
    } else {
      toInsert.push(payload);
    }
  }

  console.log(`Updating ${toUpdate.length}...`);
  for (let i = 0; i < toUpdate.length; i += 100) {
    await supabase.from('people').upsert(toUpdate.slice(i, i + 100), { onConflict: 'id' });
    process.stdout.write(`.`);
  }

  console.log(`\nInserting ${toInsert.length}...`);
  for (let i = 0; i < toInsert.length; i += 100) {
    await supabase.from('people').insert(toInsert.slice(i, i + 100));
    process.stdout.write(`.`);
  }

  console.log("\nSync Complete.");
}

main();
