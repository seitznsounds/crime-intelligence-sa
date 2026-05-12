
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestSAProfile() {
  console.log('🚀 Starting Ingestion: PPLAAF South Africa Profile (High-Profile Cases)...');

  // 1. Organizations
  const organizations = [
    { name: "National Anti-Corruption Advisory Council (NACAC)", type: "government", status: "active", description: "Advisory body monitoring SA National Anti-Corruption Strategy." },
    { name: "The Whistleblower House", type: "ngo", status: "active", description: "Support resource for whistleblowers in South Africa." },
    { name: "Corruption Watch", type: "ngo", status: "active", description: "Public resource for reporting corruption." },
    { name: "OUTA", type: "ngo", status: "active", description: "Organization Undoing Tax Abuse." },
    { name: "Gauteng Department of Health", type: "government", status: "active", description: "South African provincial department; site of the Tembisa Hospital scandal." }
  ];

  const orgMap: Record<string, string> = {};
  for (const org of organizations) {
    const { data, error } = await supabase
      .from('organizations')
      .upsert({ name: org.name, type: org.type, status: org.status, description: org.description, metadata: { source: "PPLAAF SA Profile 2025" } }, { onConflict: 'name' })
      .select('id').single();
    if (error) console.error(`❌ Org error: ${org.name}`, error);
    else orgMap[org.name] = data.id;
  }

  // 2. People
  const people = [
    { name: "Babita Deokaran", role: "Whistleblower / Chief Director", pep: 3, desc: "Assassinated in 2021 after exposing R332m suspicious spending at Tembisa Hospital.", verified: true, orgs: ["Gauteng Department of Health"] },
    { name: "Moss Phakoe", role: "Whistleblower / Councillor", pep: 3, desc: "Assassinated in 2009 after reporting fraud in Rustenburg Municipality.", verified: true, orgs: [] },
    { name: "Cloete Murray", role: "Liquidator", pep: 3, desc: "Assassinated in 2023 while working on high-profile Bosasa corruption cases.", verified: true, orgs: [] },
    { name: "Ace Magashule", role: "Former Secretary-General / Premier", pep: 1, desc: "Facing multiple counts of fraud and corruption related to the asbestos tender.", verified: false, orgs: [] }
  ];

  for (const p of people) {
    let { data: existing } = await supabase.from('people').select('id').eq('full_name', p.name).maybeSingle();
    let personId;
    if (existing) personId = existing.id;
    else {
      const { data: created, error: insertError } = await supabase.from('people').insert({ 
        full_name: p.name, role: p.role, pep_tier: p.pep, description: p.desc, is_verified: p.verified, metadata: { source: "PPLAAF SA Profile 2025" } 
      }).select('id').single();
      if (insertError) { console.error(`❌ Person error: ${p.name}`, insertError); continue; }
      personId = created.id;
    }

    for (const orgName of p.orgs) {
      if (orgMap[orgName]) {
        await supabase.from('person_org_links').insert({ person_id: personId, org_id: orgMap[orgName], role: p.role, status: "former", confidence: 100, source: "PPLAAF SA Profile 2025" });
      }
    }
    console.log(`✅ Ingested/Linked: ${p.name}`);
  }

  // 3. Incidents (Assassination Track)
  const incidents = [
    { 
      title: "Assassination of Babita Deokaran", 
      summary: "High-profile assassination of health official outside her home following reports of R332m fraudulent spending.",
      category: "Assassination",
      severity: 5,
      location_text: "Johannesburg, Gauteng",
      metadata: { date: "2021-08-23", target: "Babita Deokaran", scandal: "Tembisa Hospital" }
    },
    { 
      title: "Assassination of Moss Phakoe", 
      summary: "Assassination of ANC councillor following reports of municipal fraud. Case remains legally unresolved after acquittal of mayor.",
      category: "Assassination",
      severity: 5,
      location_text: "Rustenburg, North West",
      metadata: { date: "2009-03-14", target: "Moss Phakoe" }
    }
  ];

  for (const inc of incidents) {
    await supabase.from('incidents').insert({
      title: inc.title,
      summary: inc.summary,
      category: inc.category,
      severity: inc.severity,
      location_text: inc.location_text,
      metadata: inc.metadata,
      source_name: "PPLAAF SA Profile 2025"
    });
    console.log(`🔫 Incident Ingested: ${inc.title}`);
  }

  console.log('🚀 Ingestion Completed.');
}

ingestSAProfile();
