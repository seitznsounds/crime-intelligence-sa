import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runForecast() {
  console.log("🔍 Running Big Five Infiltration Forecast...");

  // 1. Define Known Syndicate Nucleus
  const syndicateNucleus = [
    'Vusimuzi Matlala',
    'Feroz Khan',
    'Ebrahim Kadwa',
    'Cat Matlala'
  ];

  // 2. Fetch Nucleus People and their IDs
  const { data: nucleusPeople } = await supabase
    .from('people')
    .select('id, full_name')
    .in('full_name', syndicateNucleus);

  const nucleusIds = nucleusPeople?.map(p => p.id) || [];

  // 3. Fetch Organizations directly linked to Nucleus
  const { data: directLinks } = await supabase
    .from('person_org_links')
    .select('org_id')
    .in('person_id', nucleusIds);

  const directOrgIds = [...new Set(directLinks?.map(l => l.org_id) || [])];

  // 4. Fetch all People and Organizations for network mapping
  const { data: allPeople } = await supabase.from('people').select('id, full_name, pep_tier, risk_score');
  const { data: allOrgs } = await supabase.from('organizations').select('id, name, type, risk_score, metadata');
  const { data: allLinks } = await supabase.from('person_org_links').select('person_id, org_id, role');
  const { data: allRels } = await supabase.from('person_relationships').select('source_person_id, target_person_id, confidence');

  // 5. Scoring Algorithm (Syndicate Proximity)
  const forecast = allOrgs?.map(org => {
    let score = 0;
    let factors = [];

    // Factor 1: Direct Syndicate Link (+50)
    if (directOrgIds.includes(org.id)) {
      score += 50;
      factors.push("Direct syndicate link identified");
    }

    // Factor 2: High Risk PEP Presence (risk > 80, +15 per person)
    const orgLinks = allLinks?.filter(l => l.org_id === org.id) || [];
    const highRiskPeps = orgLinks.filter(l => {
        const p = allPeople?.find(person => person.id === l.person_id);
        return p && p.risk_score && p.risk_score > 80;
    });
    if (highRiskPeps.length > 0) {
        score += highRiskPeps.length * 15;
        factors.push(`${highRiskPeps.length} high-risk PEP(s) in leadership/roles`);
    }

    // Factor 3: Sector Risk (SAPS/SCM/Intelligence +20)
    if (['law_enforcement', 'government'].includes(org.type || '') || org.name.toLowerCase().includes('scm')) {
        score += 20;
        factors.push("High-risk institutional sector");
    }

    // Factor 4: Network Degrees from Nucleus (+30 for 1st degree relationship to member)
    const linkedPeps = orgLinks.map(l => l.person_id);
    const hasNucleusConnection = allRels?.some(rel => 
        (nucleusIds.includes(rel.source_person_id) && linkedPeps.includes(rel.target_person_id)) ||
        (nucleusIds.includes(rel.target_person_id) && linkedPeps.includes(rel.source_person_id))
    );
    if (hasNucleusConnection) {
        score += 30;
        factors.push("Indirect connection to syndicate nucleus (1st degree)");
    }

    return {
      name: org.name,
      id: org.id,
      score: Math.min(100, score),
      factors: factors.slice(0, 3), // Top 3 factors
      status: score > 70 ? 'CRITICAL' : score > 40 ? 'HIGH' : 'ELEVATED'
    };
  }) || [];

  // Filter for scores > 30 and sort
  const topRisks = forecast
    .filter(f => f.score > 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const result = {
    generated_at: new Date().toISOString(),
    template_syndicate: "Big Five Cartel",
    target_nodes: topRisks
  };

  const outputPath = path.join(process.cwd(), '.intelligence/distillations/big_five_forecast.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`✅ Forecast generated: ${outputPath}`);
}

runForecast().catch(console.error);
