import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestGovernmentLeadership() {
  console.log('🚀 Starting National Government Leadership Ingestion (Fixed Status)...');

  const departments = [
    {
      name: "Department of Justice and Constitutional Development",
      leadership: [
        { full_name: "Mmamoloko Tryphosa Kubayi", role: "Minister", pep_tier: 1 },
        { full_name: "Andries Carl Nel", role: "Deputy Minister", pep_tier: 1 },
        { full_name: "Doctor Mashabane", role: "Director General", status: "Suspended", pep_tier: 1 }
      ]
    },
    {
      name: "National Prosecuting Authority",
      leadership: [
        { full_name: "Shamila Batohi", role: "National Director of Public Prosecutions", pep_tier: 1 },
        { full_name: "Anton du Plessis", role: "Deputy NDPP", pep_tier: 1 },
        { full_name: "Sibongile Mzinyathi", role: "Acting Deputy NDPP", pep_tier: 1 },
        { full_name: "Ouma Rabaji-Rasethaba", role: "Deputy NDPP (AFU)", pep_tier: 1 }
      ]
    },
    {
      name: "South African Police Service",
      leadership: [
        { full_name: "Edward Senzo Mchunu", role: "Minister of Police", status: "Leave of absence", pep_tier: 1 },
        { full_name: "Firoz Cachalia", role: "Acting Minister of Police", pep_tier: 1 },
        { full_name: "Shela Polly Boshielo", role: "Deputy Minister", pep_tier: 1 },
        { full_name: "Cassel Charlie Mathale", role: "Deputy Minister", pep_tier: 1 },
        { full_name: "Puleng Patricia Dimpane", role: "Acting National Commissioner", pep_tier: 1 },
        { full_name: "SF Masemola", role: "National Commissioner", status: "Suspended", pep_tier: 1 },
        { full_name: "Seswantsho Godfrey Lebeya", role: "Head of Hawks", pep_tier: 1 }
      ]
    },
    {
      name: "State Security Agency",
      leadership: [
        { full_name: "Khumbudzo Phophi Silence Ntshavheni", role: "Minister in The Presidency", pep_tier: 1 },
        { full_name: "Nozuko Bam", role: "Acting Director General", pep_tier: 1 }
      ]
    },
    {
      name: "Independent Police Investigative Directorate",
      leadership: [
        { full_name: "Dikeledi Jennifer Ntlatseng", role: "Executive Director", pep_tier: 1 }
      ]
    },
    {
      name: "Special Investigating Unit",
      leadership: [
        { full_name: "Andy JL Mothibi", role: "Head of Unit", pep_tier: 1 }
      ]
    }
  ];

  for (const dept of departments) {
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .upsert({ name: dept.name, type: 'government', status: 'active' }, { onConflict: 'name' })
      .select()
      .single();

    if (orgError) {
      console.error(`❌ Error upserting organization ${dept.name}:`, orgError.message);
      continue;
    }

    console.log(`✅ Organization: ${dept.name}`);

    for (const leader of dept.leadership) {
      const personData = {
        full_name: leader.full_name,
        role: leader.role,
        pep_tier: leader.pep_tier,
        metadata: { department: dept.name, status: leader.status || 'active' },
        risk_score: leader.status === 'Suspended' ? 8.0 : 2.0
      };

      const { data: person, error: personError } = await supabase
        .from('people')
        .select('id')
        .eq('full_name', leader.full_name)
        .maybeSingle();

      let personId;
      if (person) {
        const { error: updateError } = await supabase
          .from('people')
          .update(personData)
          .eq('id', person.id);
        if (updateError) console.error(`❌ Error updating ${leader.full_name}:`, updateError.message);
        else console.log(`✅ Updated: ${leader.full_name}`);
        personId = person.id;
      } else {
        const { data: newPerson, error: insertError } = await supabase
          .from('people')
          .insert(personData)
          .select()
          .single();
        if (insertError) console.error(`❌ Error inserting ${leader.full_name}:`, insertError.message);
        else console.log(`✅ Inserted: ${leader.full_name}`);
        personId = newPerson?.id;
      }

      if (personId) {
        // Use 'active' or 'former' to satisfy constraint, but note status in metadata
        const linkStatus = (leader.status === 'Suspended' || leader.status === 'Leave of absence') ? 'former' : 'active';
        
        const { error: linkError } = await supabase
          .from('person_org_links')
          .upsert({
            person_id: personId,
            org_id: org.id,
            role: leader.role,
            status: linkStatus,
            confidence: 100,
            source: 'National Government Audit May 2026',
            metadata: { operational_status: leader.status || 'active' }
          }, { onConflict: 'person_id,org_id' });

        if (linkError) console.error(`❌ Error linking ${leader.full_name} to ${dept.name}:`, linkError.message);
        else console.log(`🔗 Linked: ${leader.full_name} <-> ${dept.name} (${linkStatus})`);
      }
    }
  }

  console.log('🏁 Government Leadership Ingestion Complete.');
}

ingestGovernmentLeadership().catch(console.error);
