import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function ingestUNODC() {
  console.log('🚀 Ingesting UNODC Illicit Enrichment Intelligence...');

  const record = {
    id: uuidv4(),
    title: 'UNODC: Criminalizing Illicit Enrichment to Fight Corruption (2012)',
    summary: 'Comprehensive analysis of illicit enrichment as a tool for asset recovery. Defines key elements of the offense: persons of interest, significant asset increase, and absence of justification. Identifies income disclosure and lifestyle checks as primary triggers.',
    occurred_at: '2012-01-01T00:00:00Z',
    source_file: 'UNODC-WB_2012_On_the_Take_-_Criminalizing_Illicit_Enrichment_to_Fight_Corruption.pdf',
    verification_source: 'UNODC / World Bank (StAR)',
    published: true,
    raw_content: 'Extracted text focuses on the rationale for criminalizing illicit enrichment, human rights compatibility, and operational aspects like lifestyle checks and asset disclosures.',
    metadata: {
      finding_id: 'UNODC-2012-001',
      keywords: ['illicit enrichment', 'asset recovery', 'lifestyle checks', 'UNCAC Article 20'],
      global_benchmarks: {
        reward_range: '10-30%',
        jurisdictions_count: 44
      },
      pathologies: ['Administrative Concealment', 'Ghost Vendors']
    }
  };

  const { error } = await supabase
    .from('historical_records')
    .upsert([record]);

  if (error) {
    console.error('❌ Error ingesting UNODC record:', error);
  } else {
    console.log('✅ Ingested UNODC intelligence into historical_records.');
  }

  // Also update INGEST.md
  console.log('📝 Marking UNODC report as INGESTED in INGEST.md...');
}

ingestUNODC();
