/**
 * Anti-Corruption Incentive Calculator Logic (V1)
 * 
 * Derived from:
 * 1. Zondo Commission Recommendations (15-25% Rewards)
 * 2. HSRC RoCoSN Report (62% Fear Multiplier)
 * 3. CLEAR-AA M&E Landscape Analysis (Accountability Metrics)
 */

interface CalculatorInput {
  caseValue: number;          // Rands
  sector: 'public' | 'private';
  departmentRiskScore: number; // 0-1 (derived from platform's accountability data)
  employmentSecurity: number; // 0-1 (0 = highly vulnerable, 1 = secure tenure)
}

interface CalculatorOutput {
  grossRewardMin: number;
  grossRewardMax: number;
  riskAdjustedReward: number;
  fearMultiplierPenalty: number;
  socialOstracismPenalty: number;
  incentiveScore: number; // 0-100 (Higher = more viable to report)
  verdict: string;
}

export function calculateIncentive(input: CalculatorInput): CalculatorOutput {
  const { caseValue, departmentRiskScore, employmentSecurity } = input;
  
  // 1. Gross Reward (Zondo Pillar)
  const grossRewardMin = caseValue * 0.15;
  const grossRewardMax = caseValue * 0.25;
  const avgGrossReward = (grossRewardMin + grossRewardMax) / 2;

  // 2. Fear Multiplier (HSRC Finding: 62% Fear of Retaliation)
  const FEAR_MULTIPLIER = 0.62;
  // Penalty scales with department risk and inversely with employment security
  const fearPenalty = avgGrossReward * FEAR_MULTIPLIER * (departmentRiskScore / employmentSecurity);

  // 3. Social Ostracism (RoCoSN Index)
  // Baseline social cost of "betrayal" in high-corruption contexts
  const SOCIAL_OSTRACISM_FACTOR = 0.15; 
  const socialPenalty = avgGrossReward * SOCIAL_OSTRACISM_FACTOR;

  // 4. Risk-Adjusted Reward
  const riskAdjustedReward = avgGrossReward - fearPenalty - socialPenalty;

  // 5. Incentive Score (0-100)
  // Ratio of adjusted reward to total potential reward, normalized
  const incentiveScore = Math.max(0, Math.min(100, (riskAdjustedReward / avgGrossReward) * 100));

  // 6. Verdict Generation
  let verdict = "Low Viability: Systemic barriers (Fear/Ostracism) outweigh financial incentives.";
  if (incentiveScore > 40) verdict = "Moderate Viability: Requires strong anonymous uplink.";
  if (incentiveScore > 70) verdict = "High Viability: Financial incentive is significant relative to risk.";

  return {
    grossRewardMin,
    grossRewardMax,
    riskAdjustedReward,
    fearMultiplierPenalty: fearPenalty,
    socialOstracismPenalty: socialPenalty,
    incentiveScore,
    verdict
  };
}

// Example Run
// calculateIncentive({
//   caseValue: 1000000,
//   sector: 'public',
//   departmentRiskScore: 0.8, // High risk department (e.g., SAPS Hotspot)
//   employmentSecurity: 0.5   // Junior official
// });
