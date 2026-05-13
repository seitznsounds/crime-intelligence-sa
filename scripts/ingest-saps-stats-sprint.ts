import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestSAPSStats() {
  console.log('🚀 Starting SAPS Crime Stats Ingestion...');

  const records = [
    {
      title: "SAPS Crime Statistics Q1 2025-2026 (April - June 2025)",
      summary: "First quarter official crime statistics showing 346,182 serious crimes and 5,770 murders.",
      content: `National Overview:
- Total Serious Crimes: 346,182
- Total Murders: 5,770
- Police Murders: 18
- Firearm Murders: 2,595

Provincial Murder Breakdown:
- Gauteng: 1,429
- KwaZulu-Natal: 1,199
- Western Cape: 1,148
- Eastern Cape: 1,096

Top Murder Stations:
1. Inanda (KZN): 78
2. Mfuleni (WC): 72
3. Delft (WC): 70
4. Nyanga (WC): 58`,
      event_date: "2025-06-30T00:00:00Z",
      category: "SAPS_CRIME_STATS",
      backfill_source: "SAPS_Q1_2025_2026",
      metadata: {
        period: "Q1 2025-2026",
        total_serious_crimes: 346182,
        total_murders: 5770,
        police_murders: 18
      }
    },
    {
      title: "SAPS Crime Statistics Q2 2025-2026 (July - September 2025)",
      summary: "Second quarter official crime statistics showing 361,560 serious crimes and 5,794 murders.",
      content: `National Overview:
- Total Serious Crimes: 361,560 (4.4% increase from Q1)
- Total Murders: 5,794
- Gauteng remained the highest volume province (96,477 crimes).`,
      event_date: "2025-09-30T00:00:00Z",
      category: "SAPS_CRIME_STATS",
      backfill_source: "SAPS_Q2_2025_2026",
      metadata: {
        period: "Q2 2025-2026",
        total_serious_crimes: 361560,
        total_murders: 5794
      }
    },
    {
      title: "SAPS Crime Statistics Q3 2025-2026 (October - December 2025)",
      summary: "Third quarter official crime statistics showing 385,936 serious crimes and 6,351 murders.",
      content: `National Overview:
- Total Serious Crimes: 385,936
- Total Murders: 6,351 (9.6% increase from Q2)
- Significant spike in murders during the festive season.`,
      event_date: "2025-12-31T00:00:00Z",
      category: "SAPS_CRIME_STATS",
      backfill_source: "SAPS_Q3_2025_2026",
      metadata: {
        period: "Q3 2025-2026",
        total_serious_crimes: 385936,
        total_murders: 6351
      }
    },
    {
      title: "IPID Annual Report 2022-2023: Police Misconduct & Corruption",
      summary: "Oversight report detailing 5,274 cases of police misconduct, with a 20% increase in formal corruption investigations.",
      content: `Key Findings:
- Total Cases Reported: 5,274
- Corruption Cases (Sec 28(1)(g)): 71 (20% increase)
- Deaths in Police Custody and as a result of police action remain critical areas of focus.`,
      event_date: "2023-03-31T00:00:00Z",
      category: "IPID_OVERSIGHT",
      backfill_source: "IPID_AR_2022_2023",
      metadata: {
        total_cases: 5274,
        corruption_increase: "20%"
      }
    },
    {
      title: "PSiRA Annual Report 2023-2024: Private Security Landscape",
      summary: "Regulatory report mapping 2.8 million registered security officers and 15,113 security businesses.",
      content: `Industry Status:
- Registered Security Officers: 2.8 Million
- Employed Security Officers: 600,000+
- Compliance Inspections: 47,005 (8% increase)
- Overall Compliance Rate: 83%`,
      event_date: "2024-03-31T00:00:00Z",
      category: "PSIRA_OVERSIGHT",
      backfill_source: "PSIRA_AR_2023_2024",
      metadata: {
        total_officers: 2800000,
        compliance_rate: "83%"
      }
    },
    {
      title: "SABRIC Crime Statistics Report 2024: Digital Banking Fraud Surge",
      summary: "Banking industry report identifying an 86% surge in digital banking fraud and R1.888 billion in losses.",
      content: `Financial Crime Trends 2024:
- Digital Banking Fraud: 86% increase in incidents
- Digital Losses: R1.888 Billion (74% increase)
- Card Fraud: R1.466 Billion (26.2% increase)
- Shift from physical (ATM/Bank robbery) to digital vectors.`,
      event_date: "2024-12-31T00:00:00Z",
      category: "FINANCIAL_CRIME_STATS",
      backfill_source: "SABRIC_2024",
      metadata: {
        digital_fraud_increase: "86%",
        digital_losses_zar: "1.888 Billion"
      }
    }
  ];

  for (const record of records) {
    const { data: existing } = await supabase
      .from('historical_records')
      .select('id')
      .eq('title', record.title)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('historical_records')
        .update(record)
        .eq('id', existing.id);
      if (error) console.error(`❌ Error updating ${record.title}:`, error.message);
      else console.log(`✅ Updated: ${record.title}`);
    } else {
      const { error } = await supabase
        .from('historical_records')
        .insert(record);
      if (error) console.error(`❌ Error inserting ${record.title}:`, error.message);
      else console.log(`✅ Inserted: ${record.title}`);
    }
  }

  console.log('🏁 SAPS Crime Stats Ingestion Complete.');
}

ingestSAPSStats().catch(console.error);
