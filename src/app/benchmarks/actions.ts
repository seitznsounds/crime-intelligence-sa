"use server";

export async function getBenchmarks() {
  // In a real app, these would be fetched from a benchmarks table or periodic job
  // Source: Transparency International CPI 2025, GI-TOC Index 2025, WJP Rule of Law Index 2025
  return [
    { 
      id: "BM_01", 
      name: "Corruption Perceptions Index (CPI)", 
      category: "corruption", 
      rank: 72, 
      total: 180, 
      score: 41.0, 
      trend: "down", 
      peers: [
        { name: "Botswana", score: 60.0 }, 
        { name: "Brazil", score: 38.0 }, 
        { name: "India", score: 40.0 }
      ], 
      desc: "Measures perceived levels of public sector corruption. South Africa remains in a stagnation zone, failing to break into the upper tier of transparent nations." 
    },
    { 
      id: "BM_02", 
      name: "Global Organized Crime Index", 
      category: "crime", 
      rank: 7, 
      total: 193, 
      score: 7.18, 
      trend: "up", 
      peers: [
        { name: "Nigeria", score: 7.15 }, 
        { name: "Mexico", score: 7.57 }, 
        { name: "Italy", score: 6.30 }
      ], 
      desc: "A high score indicates high criminality and low resilience. SA's high ranking reflects deeply entrenched criminal syndicates." 
    },
    { 
      id: "BM_03", 
      name: "Rule of Law Index", 
      category: "rule_of_law", 
      rank: 56, 
      total: 142, 
      score: 0.58, 
      trend: "stable", 
      peers: [
        { name: "Namibia", score: 0.62 }, 
        { name: "Rwanda", score: 0.61 }, 
        { name: "Zambia", score: 0.45 }
      ], 
      desc: "SA performs well in open government but poorly in criminal justice efficiency." 
    }
  ];
}
