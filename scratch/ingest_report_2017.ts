
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestReport2017() {
  console.log('🚀 Starting Complex Ingestion: PPLAAF Report 2017 (Network Graph)...');

  // 1. Define Organizations
  const organizations = [
    { name: "Trillian Capital", type: "company", status: "under_investigation", description: "Financial advisory firm linked to the Gupta family and state capture." },
    { name: "McKinsey South Africa", type: "company", status: "active", description: "Global consulting firm involved in illegal payments from Eskom via Trillian." },
    { name: "Eskom", type: "government", status: "active", description: "South African state-owned electricity utility; primary victim/target of state capture." },
    { name: "BGFI Bank RDC", type: "company", status: "active", description: "Congolese subsidiary of BGFI Bank, implicated in misappropriation of public funds." },
    { name: "EGAL", type: "company", status: "active", description: "Congolese food importer used as a conduit for misappropriated Central Bank funds." }
  ];

  const orgMap: Record<string, string> = {};

  for (const org of organizations) {
    const { data, error } = await supabase
      .from('organizations')
      .upsert({ 
        name: org.name, 
        type: org.type, 
        status: org.status, 
        description: org.description,
        metadata: { source: "PPLAAF Report 2017" }
      }, { onConflict: 'name' })
      .select('id')
      .single();

    if (error) console.error(`❌ Error upserting organization ${org.name}:`, error);
    else {
      orgMap[org.name] = data.id;
      console.log(`✅ Organization Ingested: ${org.name} (${data.id})`);
    }
  }

  // 2. Define People
  const people = [
    { 
      full_name: "Mosilo Mothepu", 
      role: "Whistleblower / Former CEO", 
      pep_tier: 3, 
      description: "Former CEO of Trillian Financial Advisory; primary whistleblower on state capture financial flows.",
      is_verified: true,
      org_links: [{ orgName: "Trillian Capital", role: "CEO", status: "former" }]
    },
    { 
      full_name: "Bianca Goodson", 
      role: "Whistleblower / Former CEO", 
      pep_tier: 3, 
      description: "Former CEO of Trillian Management Consulting; exposed McKinsey/Trillian/Eskom collusion.",
      is_verified: true,
      org_links: [{ orgName: "Trillian Capital", role: "CEO", status: "former" }]
    },
    { 
      full_name: "Jean-Jacques Lumumba", 
      role: "Whistleblower / Former Executive", 
      pep_tier: 3, 
      description: "Former senior official at BGFI Bank RDC; exposed the 'Lumumba Papers' regarding DRC corruption.",
      is_verified: true,
      org_links: [{ orgName: "BGFI Bank RDC", role: "Executive", status: "former" }]
    },
    { 
      full_name: "Salim Essa", 
      role: "State Capture Associate", 
      pep_tier: 2, 
      description: "Key associate of the Gupta family; owner of Trillian Capital.",
      is_verified: false,
      org_links: [{ orgName: "Trillian Capital", role: "Owner", status: "active" }]
    }
  ];

  for (const person of people) {
    // Check if person exists
    let { data: existingPerson, error: findError } = await supabase
      .from('people')
      .select('id')
      .eq('full_name', person.full_name)
      .maybeSingle();

    let personId;
    if (existingPerson) {
      personId = existingPerson.id;
      console.log(`ℹ️ Person already exists: ${person.full_name} (${personId})`);
    } else {
      const { data: newPerson, error: insertError } = await supabase
        .from('people')
        .insert({ 
          full_name: person.full_name, 
          role: person.role, 
          pep_tier: person.pep_tier,
          description: person.description,
          is_verified: person.is_verified,
          metadata: { source: "PPLAAF Report 2017" }
        })
        .select('id')
        .single();
      
      if (insertError) {
        console.error(`❌ Error inserting person ${person.full_name}:`, insertError);
        continue;
      }
      personId = newPerson.id;
      console.log(`✅ Person Ingested: ${person.full_name} (${personId})`);
    }
      
    // Link to Organizations
    for (const link of person.org_links) {
      if (orgMap[link.orgName]) {
        const { error: linkError } = await supabase
          .from('person_org_links')
          .insert({
            person_id: personId,
            org_id: orgMap[link.orgName],
            role: link.role,
            status: link.status,
            confidence: 100,
            source: "PPLAAF Report 2017"
          });
        if (linkError) console.error(`❌ Error linking ${person.full_name} to ${link.orgName}:`, linkError);
        else console.log(`🔗 Linked ${person.full_name} to ${link.orgName}`);
      }
    }
  }

  // 3. Ingest Key Incident Summaries into Knowledge Base
  const kbRecords = [
    {
      title: "GuptaLeaks: The Blueprint for State Capture",
      content: "The GuptaLeaks comprise 540,000 documents revealing how the Gupta family influenced government appointments and raided state resources. PPLAAF was a key partner in securing and analyzing this data alongside amaBhungane and Daily Maverick.",
      metadata: { category: "Evidence", volume: "540k records" }
    },
    {
      title: "McKinsey/Trillian Eskom Seizure",
      content: "In January 2018, the Asset Forfeiture Unit (AFU) seized R1.1 billion from McKinsey and R95 million from Trillian following revelations of illegal payments from Eskom. This was a direct result of whistleblower evidence supported by PPLAAF.",
      metadata: { category: "Restitution", amount: "R1.195 billion" }
    }
  ];

  for (const record of kbRecords) {
    const { error: kbError } = await supabase
      .from('ai_knowledge_base')
      .upsert({
        content: `${record.title}\n\n${record.content}`,
        metadata: { ...record.metadata, title: record.title },
        source: 'PPLAAF Report 2017'
      });
    if (kbError) console.error('❌ Error ingesting knowledge base:', kbError);
    else console.log(`🧠 Ingested Knowledge Base Record: ${record.title}`);
  }

  console.log('🚀 Network Graph Ingestion Completed.');
}

ingestReport2017();
