import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function consolidateSyndicates() {
  console.log("Starting Syndicate Consolidation...");

  // 1. Fetch all syndicates
  const { data: syndicates, error: syndErr } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('type', 'syndicate');

  if (syndErr) throw syndErr;

  // Identify canonical IDs
  const numbersGang = syndicates?.find(s => s.name === 'Numbers Gang (26s, 27s, 28s)');
  const americansGang = syndicates?.find(s => s.name === 'Americans Gang');

  // Map of aliases to Canonical target
  const merges = [
    { from: '27s', to: numbersGang?.id },
    { from: 'The 27s', to: numbersGang?.id },
    { from: 'Underworld / 27s Associate', to: numbersGang?.id },
    { from: 'Terrible Josters / 28s', to: numbersGang?.id },
    { from: 'Americans vs Rivals', to: americansGang?.id },
  ];

  // 2. Process Merges
  for (const merge of merges) {
    if (!merge.to) continue;
    const sourceSyndicates = syndicates?.filter(s => s.name === merge.from);
    if (!sourceSyndicates || sourceSyndicates.length === 0) continue;

    for (const source of sourceSyndicates) {
      console.log(`Merging ${source.name} [${source.id}] -> Canonical [${merge.to}]`);
      
      // Update all person_org_links
      const { data: links, error: fetchLinksErr } = await supabase
        .from('person_org_links')
        .select('*')
        .eq('org_id', source.id);

      if (links && links.length > 0) {
        for (const link of links) {
          // Attempt to insert new link, handle constraint violations if already exists
          const { error: insertErr } = await supabase
            .from('person_org_links')
            .upsert({
              person_id: link.person_id,
              org_id: merge.to,
              role_in_org: link.role_in_org,
              start_date: link.start_date,
              end_date: link.end_date,
              confidence_score: link.confidence_score,
            }, { onConflict: 'person_id, org_id' });
            
          if (insertErr) {
            console.error(`Error migrating link for person ${link.person_id}:`, insertErr.message);
          }
        }
      }

      // Hard delete old syndicate
      await supabase.from('organizations').delete().eq('id', source.id);
      console.log(`Deleted merged syndicate: ${source.name}`);
    }
  }

  // 3. Strict Allowlist Enforce
  const allowList = [
    'Americans Gang',
    'Big Five Cartel',
    'Bloods Gang',
    'Cape Taxi Cartel',
    'CATA / Taxi Violence',
    'Cat VIP Protection Services',
    'DLO Energy Resources Group',
    'Dubai-based Suvarna Royal Gold Trading',
    'Fair Trade Independent Tobacco Association',
    'Falcon Cat Trading and Suppliers',
    'Gold Mafia',
    'Hard Livings',
    'Israeli Mafia',
    'Medicare 24',
    'Numbers Gang (26s, 27s, 28s)',
    'PKSA Group',
    'Space Research Corporation (SRC)',
    'Tatu Gang',
    'The Green Lounge'
  ];

  // Refetch remaining syndicates after merges
  const { data: remainingSyndicates } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('type', 'syndicate');

  let deletedJunk = 0;
  for (const s of remainingSyndicates || []) {
    if (!allowList.includes(s.name)) {
      console.log(`Eradicating Non-Allowlisted Syndicate: ${s.name}`);
      await supabase.from('organizations').delete().eq('id', s.id);
      deletedJunk++;
    }
  }

  console.log(`\n✅ Consolidation Complete! Eradicated ${deletedJunk} junk syndicates.`);
}

consolidateSyndicates().catch(console.error);
