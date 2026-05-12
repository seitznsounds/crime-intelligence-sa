
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestReport2020() {
  console.log('🚀 Starting Ingestion: PPLAAF Report 2020 (PIC & Fishrot)...');

  // 1. Organizations
  const organizations = [
    { name: "Public Investment Corporation (PIC)", type: "government", status: "active", description: "South Africa's largest asset manager; manages R2 trillion+ in government pensions." },
    { name: "Samherji", type: "company", status: "active", description: "Icelandic fishing giant central to the Fishrot bribery scandal." },
    { name: "Mpati Commission", type: "government", status: "dissolved", description: "Judicial commission into PIC impropriety." },
    { name: "Police Service Commission (Nigeria)", type: "government", status: "active", description: "Agency overseeing the Nigeria Police Force; site of major procurement fraud." }
  ];

  const orgMap: Record<string, string> = {};
  for (const org of organizations) {
    const { data, error } = await supabase
      .from('organizations')
      .upsert({ name: org.name, type: org.type, status: org.status, description: org.description, metadata: { source: "PPLAAF Report 2020" } }, { onConflict: 'name' })
      .select('id').single();
    if (error) console.error(`❌ Org error: ${org.name}`, error);
    else orgMap[org.name] = data.id;
  }

  // 2. People
  const people = [
    { name: "Simphiwe Mayisela", role: "Whistleblower / CIO", pep: 3, desc: "Former PIC CIO; exposed corruption involving Dan Matjila.", verified: true, orgs: ["Public Investment Corporation (PIC)"] },
    { name: "Bongani Mathebula", role: "Whistleblower / Corp Secretary", pep: 3, desc: "Former PIC Corporate Secretary; victim of internal victimization.", verified: true, orgs: ["Public Investment Corporation (PIC)"] },
    { name: "Dan Matjila", role: "Former CEO", pep: 2, desc: "Former CEO of PIC; alleged to have authorized illegal transactions and victimized whistleblowers.", verified: false, orgs: ["Public Investment Corporation (PIC)"] },
    { name: "Johannes Stefansson", role: "Whistleblower / Director", pep: 3, desc: "Former Samherji director; exposed the Fishrot scandal.", verified: true, orgs: ["Samherji"] },
    { name: "Aaron Kaase", role: "Whistleblower / Senior Officer", pep: 3, desc: "Exposed procurement fraud at Nigeria's PSC.", verified: true, orgs: ["Police Service Commission (Nigeria)"] }
  ];

  for (const p of people) {
    let { data: existing, error: findError } = await supabase.from('people').select('id').eq('full_name', p.name).maybeSingle();
    let personId;
    if (existing) personId = existing.id;
    else {
      const { data: created, error: insertError } = await supabase.from('people').insert({ full_name: p.name, role: p.role, pep_tier: p.pep, description: p.desc, is_verified: p.verified, metadata: { source: "PPLAAF Report 2020" } }).select('id').single();
      if (insertError) { console.error(`❌ Person error: ${p.name}`, insertError); continue; }
      personId = created.id;
    }

    for (const orgName of p.orgs) {
      if (orgMap[orgName]) {
        await supabase.from('person_org_links').insert({ person_id: personId, org_id: orgMap[orgName], role: p.role, status: "former", confidence: 100, source: "PPLAAF Report 2020" });
      }
    }
    console.log(`✅ Ingested/Linked: ${p.name}`);
  }

  // 3. Knowledge Base
  const kb = [
    { title: "The PIC Pattern", content: "Systematic victimization of whistleblowers within the Public Investment Corporation (PIC) to hide illegal transactions, as exposed by Mayisela and Mathebula." },
    { title: "Fishrot Scandal", content: "Transnational bribery scheme involving Icelandic company Samherji and high-ranking Namibian officials for fishing quotas." }
  ];

  for (const item of kb) {
    await supabase.from('ai_knowledge_base').insert({ content: `${item.title}\n\n${item.content}`, metadata: { title: item.title, category: "Case Study" }, source: "PPLAAF Report 2020" });
    console.log(`🧠 Knowledge Base: ${item.title}`);
  }

  console.log('🚀 Ingestion Completed.');
}

ingestReport2020();
