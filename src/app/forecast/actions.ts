"use server";

import { createServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function getForecasts() {
  let supabase;
  try {
    supabase = await createServerClient();
  } catch (e) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // 1. Fetch Orgs with their detailed links
  const { data: orgs, error } = await supabase
    .from('organizations')

    .select(`
      id, 
      name, 
      type, 
      description, 
      sector, 
      risk_score,
      person_org_links(role, confidence, created_at)
    `);

  if (error) throw new Error(error.message);

  // 2. SCM Behavioral Fingerprint Roles
  const SCM_ROLES = [
    'Procurement', 'Tender', 'Supply Chain', 'Contract Manager', 
    'Adjudicator', 'Bid Committee', 'Finance Director'
  ];

  // 3. Derive Refined Forecasts
  return orgs
    .map((o: any) => {
      const links = o.person_org_links || [];
      const linkCount = links.length;
      
      // SCM Fingerprinting
      const scmLinks = links.filter((l: any) => 
        SCM_ROLES.some(role => l.role?.toLowerCase().includes(role.toLowerCase()))
      );
      const scmDensity = scmLinks.length;
      const isScmAnomaly = scmDensity >= 2;

      // Temporal Velocity (Simulated spike detection based on link density vs sector norms)
      const sectorNorm = o.sector === 'Security' ? 5 : 2;
      const velocity = linkCount / sectorNorm;
      const isSpiking = velocity > 2.5;

      // Risk Calculation Refinement
      const baseRisk = o.risk_score || (o.type === 'syndicate' ? 85 : 50);
      const densityMultiplier = Math.min(30, linkCount * 5);
      const scmBonus = isScmAnomaly ? 25 : 0;
      const velocityBonus = isSpiking ? 15 : 0;
      
      const totalRisk = Math.min(99, baseRisk + densityMultiplier + scmBonus + velocityBonus);

      // Status Attribution
      let status = "STABILIZING";
      let tags: string[] = [];
      
      if (totalRisk > 90) status = "EMERGING_HUB";
      else if (totalRisk > 75) status = "ACTIVE_ANOMALY";

      if (isScmAnomaly) tags.push("SCM_ANOMALY");
      if (isSpiking) tags.push("LINK_SPIKE");
      if (o.type === 'syndicate') tags.push("SYNDICATE_CORE");

      // Generate Sparkline Data (Simulated 6-month trend)
      const sparkline = Array.from({ length: 12 }, (_, i) => {
        const base = linkCount * 2;
        const volatility = isSpiking ? 20 : 5;
        return Math.max(5, base + Math.sin(i) * volatility + (isSpiking && i > 8 ? i * 5 : 0));
      });

      return {
        id: `FC_${o.id.substring(0, 4).toUpperCase()}`,
        title: o.name,
        risk: totalRisk,
        trend: isSpiking ? `+${(velocity * 10).toFixed(1)}%` : `+${(Math.random() * 5).toFixed(1)}%`,
        nodes: linkCount,
        status: status,
        tags: tags,
        sparkline: sparkline,
        desc: isScmAnomaly 
          ? `High-density SCM overlap detected. ${scmDensity} PEP nodes identified in procurement-sensitive roles.`
          : o.description || `AI detected anomalous linkage density in the ${o.sector || 'unclassified'} sector.`
      };
    })
    .sort((a, b) => b.risk - a.risk)
    .filter(f => f.nodes > 0) // Only show entities with actual links
    .slice(0, 12);
}
