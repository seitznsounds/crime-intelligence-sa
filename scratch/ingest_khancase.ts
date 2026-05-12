
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function ingest() {
  console.log("Starting high-fidelity intelligence ingestion: Major General Feroz Khan Case...");

  // 1. Upsert Organizations
  const organizations = [
    { name: "South African Police Service (SAPS)", type: "law_enforcement", status: "active", description: "National police force of South Africa." },
    { name: "Directorate for Priority Crime Investigation (Hawks)", type: "law_enforcement", status: "active", description: "Specialized unit of the SAPS." },
    { name: "Crime Intelligence (SAPS)", type: "law_enforcement", status: "active", description: "Intelligence wing of the SAPS." },
    { name: "Big Five Cartel", type: "syndicate", status: "under_investigation", description: "Transnational criminal network operating within and alongside the SAPS." },
    { name: "Point Blank Security", type: "company", status: "under_investigation", headquarters: "Durban" },
    { name: "Medicare 24 Tshwane District", type: "company", status: "under_investigation", description: "Healthcare company involved in R360m SAPS tender fraud." },
    { name: "Cat VIP Protection Services", type: "company", status: "under_investigation" },
    { name: "Falcon Cat Trading", type: "company", status: "under_investigation" },
    { name: "Spares Oasis", type: "company", status: "active", description: "Motor parts chain valued at ~R21 million owned by Feroz Khan." },
    { name: "Political Killings Task Team (PKTT)", type: "law_enforcement", status: "active" },
    { name: "Gaolatlhe", type: "company", status: "under_investigation", description: "Alleged conduit company for cartel bribes." }
  ];

  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .upsert(organizations, { onConflict: 'name' })
    .select();

  if (orgError) console.error("Org Error:", orgError);
  const orgMap = Object.fromEntries(orgData?.map(o => [o.name, o.id]) || []);

  // 2. Upsert People (Manual check since no unique constraint on full_name)
  const people = [
    { full_name: "Feroz Khan", pep_tier: 1, role: "Head of Counter and Security Intelligence, SAPS", status: "arrested", risk_score: 95, description: "Major General implicated in gold smuggling and cocaine theft. Operates commercial empire." },
    { full_name: "Ebrahim Kadwa", pep_tier: 1, role: "Gauteng Provincial Head, DPCI (Hawks)", status: "arrested", risk_score: 90, description: "Major General implicated in gold smuggling and cocaine theft." },
    { full_name: "Tariq Downes", pep_tier: 3, role: "Director, Point Blank Security", status: "arrested", risk_score: 85, description: "Durban businessman caught with unwrought gold at OR Tambo." },
    { full_name: "Fannie Masemola", pep_tier: 1, role: "Suspended National Police Commissioner", status: "arrested", risk_score: 88, description: "Suspended over R360m Medicare 24 tender fraud." },
    { full_name: "Vusimuzi Matlala", pep_tier: 3, role: "Big Five Cartel Boss", status: "arrested", risk_score: 98, description: "Known as 'Cat'. Tender tycoon and alleged cartel financier." },
    { full_name: "Senzo Mchunu", pep_tier: 1, role: "Suspended Police Minister", status: "suspended", risk_score: 75, description: "Suspended over allegations of cartel bribery and interference." },
    { full_name: "Shadrack Sibiya", pep_tier: 1, role: "Suspended Deputy National Commissioner", status: "suspended", risk_score: 82, description: "Alleged recipient of monthly cartel bribes." },
    { full_name: "Richard Shibiri", pep_tier: 1, role: "Head of Organised Crime", status: "under_investigation", risk_score: 78, description: "Alleged recipient of cartel kickbacks." },
    { full_name: "Fannie Nkosi", pep_tier: 3, role: "Sergeant, Organised Crime Unit", status: "arrested", risk_score: 80, description: "Alleged bagman for cartel bribes to senior leadership." },
    { full_name: "Brown Mogotsi", pep_tier: 3, role: "Crime Intelligence Contact Agent", status: "active", risk_score: 70, description: "Disinformation specialist for the Big Five cartel." },
    { full_name: "Nhlanhla Mkhwanazi", pep_tier: 1, role: "KZN Police Commissioner", status: "active", risk_score: 10, description: "Integrity officer who exposed cartel infiltration." }
  ];

  const personResults = [];
  for (const p of people) {
    const { data: existing } = await supabase.from('people').select('id').eq('full_name', p.full_name).single();
    if (existing) {
      const { data: updated } = await supabase.from('people').update(p).eq('id', existing.id).select().single();
      personResults.push(updated);
    } else {
      const { data: inserted } = await supabase.from('people').insert(p).select().single();
      personResults.push(inserted);
    }
  }
  const personMap = Object.fromEntries(personResults.map(p => [p.full_name, p.id]));

  // 3. Upsert Incidents (Manual check since no unique constraint on title)
  const incidents = [
    { 
      title: "Precious Metals Smuggling Arrest (May 2026)", 
      summary: "Major-General Feroz Khan and Ebrahim Kadwa arrested for unlawful gold dealing.",
      occurred_at: "2026-05-10",
      status: "under_investigation",
      crime_category: "Illegal Mining & Smuggling",
      modus_operandi: "Fabricating undercover operations to release smugglers."
    },
    { 
      title: "Aeroton Cocaine Heist (July 2021)", 
      summary: "715kg cocaine shipment intercepted; 136kg subsequently stolen from state forensic lab.",
      occurred_at: "2021-07-09",
      status: "unresolved",
      crime_category: "Drug Trafficking",
      modus_operandi: "Fracturing evidentiary chain of custody to steal high-value narcotics."
    },
    { 
      title: "Medicare 24 Tender Fraud (2024)", 
      summary: "R360m SAPS medical contract awarded to cartel-linked company.",
      occurred_at: "2024-01-01",
      status: "under_investigation",
      crime_category: "Corruption & Tender Fraud",
      modus_operandi: "Manipulation of bid specifications by compromised SCM officers."
    }
  ];

  const incidentResults = [];
  for (const i of incidents) {
    const { data: existing } = await supabase.from('incidents').select('id').eq('title', i.title).single();
    if (existing) {
      const { data: updated } = await supabase.from('incidents').update(i).eq('id', existing.id).select().single();
      incidentResults.push(updated);
    } else {
      const { data: inserted } = await supabase.from('incidents').insert(i).select().single();
      incidentResults.push(inserted);
    }
  }
  const incidentMap = Object.fromEntries(incidentResults.map(i => [i.title, i.id]));

  // 4. Create Network Links
  const personOrgLinks = [
    { person_id: personMap["Feroz Khan"], org_id: orgMap["Crime Intelligence (SAPS)"], role: "Head of Counter Intelligence" },
    { person_id: personMap["Ebrahim Kadwa"], org_id: orgMap["Directorate for Priority Crime Investigation (Hawks)"], role: "Provincial Head" },
    { person_id: personMap["Vusimuzi Matlala"], org_id: orgMap["Big Five Cartel"], role: "Boss/Financier" },
    { person_id: personMap["Tariq Downes"], org_id: orgMap["Point Blank Security"], role: "Director" },
    { person_id: personMap["Feroz Khan"], org_id: orgMap["Spares Oasis"], role: "Owner" }
  ];

  await supabase.from('person_org_links').upsert(personOrgLinks);

  const personIncidentLinks = [
    { person_id: personMap["Feroz Khan"], incident_id: incidentMap["Precious Metals Smuggling Arrest (May 2026)"], role: "suspect" },
    { person_id: personMap["Ebrahim Kadwa"], incident_id: incidentMap["Precious Metals Smuggling Arrest (May 2026)"], role: "suspect" },
    { person_id: personMap["Tariq Downes"], incident_id: incidentMap["Precious Metals Smuggling Arrest (May 2026)"], role: "suspect" },
    { person_id: personMap["Vusimuzi Matlala"], incident_id: incidentMap["Medicare 24 Tender Fraud (2024)"], role: "suspect" },
    { person_id: personMap["Feroz Khan"], incident_id: incidentMap["Aeroton Cocaine Heist (July 2021)"], role: "suspect" }
  ];

  await supabase.from('person_incident_links').upsert(personIncidentLinks);

  const personRelationships = [
    { source_person_id: personMap["Feroz Khan"], target_person_id: personMap["Vusimuzi Matlala"], relationship_type: "associate", evidence_summary: "Khan used Matlala's Menlyn penthouse as operational base." },
    { source_person_id: personMap["Vusimuzi Matlala"], target_person_id: personMap["Senzo Mchunu"], relationship_type: "financier", evidence_summary: "Alleged R500k donation to ANC presidency campaign." },
    { source_person_id: personMap["Fannie Nkosi"], target_person_id: personMap["Shadrack Sibiya"], relationship_type: "handler", evidence_summary: "Nkosi acted as bagman for Sibiya's bribe packages." }
  ];

  await supabase.from('person_relationships').upsert(personRelationships);

  console.log("Intelligence Hub updated successfully with May 2026 SAPS/Cartel Infiltration data.");
}

ingest();
