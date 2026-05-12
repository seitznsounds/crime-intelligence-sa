
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function upsertPeople() {
  const people = [
    {
      full_name: "Fannie Masemola",
      role: "National Police Commissioner",
      status: "Arrested/Charged",
      pep_tier: 1,
      metadata: { charges: "PFMA violations", tender_amount: "R360m", company: "Medicare24" }
    },
    {
      full_name: "Feroz Khan",
      role: "Major-General, Crime Intelligence",
      status: "Arrested",
      pep_tier: 2,
      metadata: { charges: "Precious metals smuggling, Defeating ends of justice", location: "OR Tambo" }
    },
    {
      full_name: "Ebrahim Kadwa",
      role: "Major-General, Gauteng Hawks Head",
      status: "Arrested",
      pep_tier: 2,
      metadata: { charges: "Precious metals smuggling, Defeating ends of justice", location: "OR Tambo" }
    },
    {
      full_name: "Lesetja Senona",
      role: "Major-General, KZN Hawks Head",
      status: "Implicated",
      pep_tier: 2,
      metadata: { links: "Big Five Cartel", associate: "Vusi 'Cat' Matlala" }
    },
    {
      full_name: "Julius Mkhwanazi",
      role: "Acting Ekurhuleni Police Head / Deputy Chief EMPD",
      status: "Implicated",
      pep_tier: 2,
      metadata: { links: "Big Five Cartel", incident: "Meyerton copper theft" }
    },
    {
      full_name: "Vusimuzi 'Cat' Matlala",
      role: "Businessman / Cartel Node",
      status: "Under Investigation",
      pep_tier: 3,
      metadata: { syndicate: "Big Five Cartel", company: "Medicare24", charges: "Attempted murder" }
    },
    {
      full_name: "Katiso 'KT' Molefe",
      role: "Businessman / Cartel Node",
      status: "Under Investigation",
      pep_tier: 3,
      metadata: { syndicate: "Big Five Cartel", incident: "DJ Sumbody murder" }
    },
    {
      full_name: "Fadiel Adams",
      role: "MP, National Coloured Congress Leader",
      status: "Arrested",
      pep_tier: 1,
      metadata: { charges: "Fraud, Defeating ends of justice", whistleblower: true }
    },
    {
      full_name: "Sindiso Magaqa",
      role: "Former ANC Youth League Secretary-General",
      is_deceased: true,
      cause_of_death: "Assassination",
      date_of_death: "2017-09-04",
      metadata: { motive: "Municipal tenders" }
    },
    {
      full_name: "Marius van der Merwe",
      role: "Private Security Owner (Witness D)",
      is_deceased: true,
      cause_of_death: "Assassination",
      date_of_death: "2025-12-01",
      metadata: { witness: true, commission: "Madlanga Commission" }
    },
    {
      full_name: "Jaco Hanekom",
      role: "Police Informant",
      is_deceased: true,
      cause_of_death: "Assassination",
      date_of_death: "2023-03-01",
      metadata: { incident: "Meyerton copper theft" }
    },
    {
      full_name: "Armand Swart",
      role: "Q-Tech Engineer",
      is_deceased: true,
      cause_of_death: "Assassination",
      date_of_death: "2024-01-01",
      metadata: { motive: "Transnet procurement fraud" }
    }
  ];

  for (const person of people) {
    const { data, error } = await supabase
      .from('people')
      .upsert(person, { onConflict: 'full_name' })
      .select();
    if (error) console.error(`Error upserting ${person.full_name}:`, error);
    else console.log(`Upserted ${person.full_name}`);
  }
}

async function upsertOrgs() {
  const orgs = [
    { name: "SAPS", type: "law_enforcement", status: "active" },
    { name: "IPID", type: "government", status: "active" },
    { name: "Big Five Cartel", type: "syndicate", status: "under_investigation", description: "Consolidated crime syndicate operating across Gauteng and KZN ports." },
    { name: "Political Killings Task Team (PKTT)", type: "law_enforcement", status: "under_investigation" },
    { name: "Madlanga Commission", type: "government", status: "active", description: "Judicial Commission of Inquiry into Criminality, Political Interference, and Corruption in the Criminal Justice System." },
    { name: "Medicare24", type: "company", status: "under_investigation", description: "Recipient of irregular R360m SAPS wellness tender." },
    { name: "Point Blank Security", type: "company", status: "under_investigation" }
  ];

  for (const org of orgs) {
    const { data, error } = await supabase
      .from('organizations')
      .upsert(org, { onConflict: 'name' })
      .select();
    if (error) console.error(`Error upserting ${org.name}:`, error);
    else console.log(`Upserted ${org.name}`);
  }
}

async function upsertIncidents() {
  const incidents = [
    {
      title: "Aeroton Drug Consignment Theft",
      summary: "Theft of 715kg cocaine from a truck at Yellow Jersey Logistics.",
      crime_category: "Drug Trafficking",
      severity: "Critical",
      status: "under_investigation",
      metadata: { amount: "715kg", location: "Aeroton", station_implicated: "Zonkizizwe" }
    },
    {
      title: "Port Shepstone Hawks Cocaine Theft",
      summary: "541kg of cocaine stolen directly from Hawks offices in Port Shepstone.",
      crime_category: "Drug Trafficking",
      severity: "Critical",
      status: "under_investigation",
      metadata: { amount: "541kg", vulnerability: "Disabled alarms, no guards" }
    },
    {
      title: "Medicare24 Corrupt Wellness Tender",
      summary: "Irregular R360 million contract awarded by National Commissioner Fannie Masemola.",
      crime_category: "Procurement Fraud",
      severity: "High",
      status: "under_investigation",
      metadata: { amount: "R360m", beneficiary: "Cat Matlala" }
    },
    {
      title: "OR Tambo Gold Smuggling Intervention",
      summary: "Illegal release of gold smuggler Tariq Downes via fake undercover operation.",
      crime_category: "Corruption",
      severity: "High",
      status: "under_investigation",
      metadata: { implicated: ["Feroz Khan", "Ebrahim Kadwa"] }
    }
  ];

  for (const incident of incidents) {
    const { data, error } = await supabase
      .from('incidents')
      .upsert(incident, { onConflict: 'title' })
      .select();
    if (error) console.error(`Error upserting incident ${incident.title}:`, error);
    else console.log(`Upserted incident ${incident.title}`);
  }
}

async function upsertHistoricalRecords() {
  const records = [
    {
      title: "SAPS Officer Suicide Crisis (2022-2026)",
      category: "Mental Health",
      summary: "Quantitative analysis of self-harm and suicide among SAPS members.",
      content: `Epidemiological data reveals a sustained crisis:
2022/2023: 45 completed suicides
2023/2024: 62 completed suicides
2024/2025: 54 completed suicides
Total self-harm incidents (including attempts) peaked at 66 in 2023/2024. Stigma and trauma saturation remain primary drivers.`,
      tags: ["Suicide", "SAPS", "Mental Health", "Trauma"],
      metadata: { source: "Parliamentary Portfolio Committee on Police" }
    },
    {
      title: "National Femicide & GBV Crisis Analysis",
      category: "GBVF",
      summary: "Analysis of intimate partner femicide and domestic violence rates.",
      content: `South Africa's femicide rate stands at 5.5 per 100,000 women—nearly 5x the global average.
Domestic violence reports increased from 33,000 (2020/21) to 63,000 (2023/24).
Officer-involved femicide (Hanzlick-Koponen typology) is a critical vector, characterized by high-lethality service weapon access and toxic masculinity within ranks.`,
      tags: ["Femicide", "GBV", "SAPS", "Hanzlick-Koponen"],
      metadata: { source: "UNODC, IPID, StatsSA" }
    }
  ];

  for (const record of records) {
    const { data, error } = await supabase
      .from('historical_records')
      .upsert(record, { onConflict: 'title' })
      .select();
    if (error) console.error(`Error upserting record ${record.title}:`, error);
    else console.log(`Upserted record ${record.title}`);
  }
}

async function main() {
  await upsertPeople();
  await upsertOrgs();
  await upsertIncidents();
  await upsertHistoricalRecords();
}

main();
