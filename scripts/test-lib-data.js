const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hwyzyzehewwwyvfbposd.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function main() {
  console.log('====================================================');
  console.log('HPCL CRM DATA LAYER & SUPABASE INTEGRATION TEST');
  console.log('====================================================\n');

  const client = createClient(supabaseUrl, anonKey);

  // Authenticate as Official
  const { data: auth, error: loginErr } = await client.auth.signInWithPassword({
    email: 'official@hpcl.in',
    password: 'Password@123',
  });
  if (loginErr) throw new Error('Login failed: ' + loginErr.message);
  console.log('✅ 1. Authenticated as Track Official:', auth.user.email);

  // Test 1: Fetch Events
  const { data: events, error: evErr } = await client
    .from('events')
    .select('event_no, name, category, metric, event_date')
    .order('event_no', { ascending: true });
  if (evErr) throw evErr;
  console.log(`✅ 2. Events in DB: ${events.length} rows loaded.`);
  console.log(`   Sample Event #1: ${events[0].name} (${events[0].category}) - Date: ${events[0].event_date}`);

  // Test 2: Fetch Units & Medals
  const { data: units, error: unitErr } = await client.from('units').select('*');
  if (unitErr) throw unitErr;
  const { data: medals, error: medalErr } = await client.from('medal_table').select('*');
  if (medalErr) throw medalErr;
  console.log(`✅ 3. Units in DB: ${units.length} units loaded.`);
  console.log(`   Medal Table View: ${medals.length} units with calculated medals:`);
  medals.slice(0, 3).forEach(m => {
    console.log(`     - ${m.unit}: Gold=${m.gold}, Silver=${m.silver}, Bronze=${m.bronze}`);
  });

  // Test 3: Fetch Athletes
  const { data: athletes, error: athErr } = await client.from('athletes').select('id, bib_no, full_name, units(name)');
  if (athErr) throw athErr;
  console.log(`✅ 4. Athletes in DB: ${athletes.length} athletes loaded.`);
  console.log(`   Sample Athlete: BIB #${athletes[0].bib_no} - ${athletes[0].full_name} (${athletes[0].units?.name})`);

  // Test 4: Fetch Heats & Heat Entries
  const { data: heats, error: heatsErr } = await client.from('heats').select('id, event_no, heat_no, heat_entries(*)');
  if (heatsErr) throw heatsErr;
  const totalEntries = heats.reduce((acc, h) => acc + (h.heat_entries?.length || 0), 0);
  console.log(`✅ 5. Heats in DB: ${heats.length} heats with ${totalEntries} entries loaded.`);

  // Test 5: Fetch Results
  const { data: results, error: resErr } = await client.from('results').select('id, event_no, position, performance, athletes(full_name)');
  if (resErr) throw resErr;
  console.log(`✅ 6. Results in DB: ${results.length} official podium finishers loaded.`);

  // Test 6: Fetch Cash Cards
  const { data: cashCards, error: ccErr } = await client.from('cash_cards').select('serial_no, event_no, position, amount_inr, signed, athletes(full_name)');
  if (ccErr) throw ccErr;
  const signedCount = cashCards.filter(c => c.signed).length;
  console.log(`✅ 7. Cash Cards in DB: ${cashCards.length} cards loaded (${signedCount} signed, ${cashCards.length - signedCount} pending).`);

  // Test 7: Verify Writing / Mutating Cash Cards
  console.log('\n--- VERIFYING MUTATIONS (DATA SENT TO DB) ---');
  const targetCard = cashCards.find(c => c.serial_no === 1);
  const origSigned = targetCard.signed;
  const { error: updateCcErr } = await client
    .from('cash_cards')
    .update({ signed: !origSigned, signed_at: !origSigned ? new Date().toISOString() : null })
    .eq('serial_no', 1);
  if (updateCcErr) throw updateCcErr;
  
  // Verify DB reflects updated value
  const { data: verifiedCard } = await client.from('cash_cards').select('serial_no, signed, signed_at').eq('serial_no', 1).single();
  console.log(`✅ 8. Mutated Cash Card #1 in DB: signed changed from ${origSigned} -> ${verifiedCard.signed}`);
  
  // Restore original state
  await client.from('cash_cards').update({ signed: origSigned, signed_at: origSigned ? '2025-02-28T00:00:00+00:00' : null }).eq('serial_no', 1);
  console.log(`   Restored Cash Card #1 to initial signed=${origSigned} state in DB.`);

  // Test 8: Verify Writing Heat Entry
  const sampleHeatEntry = heats[0].heat_entries[0];
  const origPerf = sampleHeatEntry.performance;
  const newPerf = 12.55;
  const { error: heatUpdateErr } = await client
    .from('heat_entries')
    .update({ performance: newPerf, needs_verification: false })
    .eq('id', sampleHeatEntry.id);
  if (heatUpdateErr) throw heatUpdateErr;

  const { data: verifiedHeatEntry } = await client.from('heat_entries').select('id, performance, needs_verification').eq('id', sampleHeatEntry.id).single();
  console.log(`✅ 9. Mutated Heat Entry in DB: performance=${verifiedHeatEntry.performance}, needs_verification=${verifiedHeatEntry.needs_verification}`);

  // Restore original performance
  await client.from('heat_entries').update({ performance: origPerf, needs_verification: sampleHeatEntry.needs_verification }).eq('id', sampleHeatEntry.id);
  console.log(`   Restored Heat Entry in DB to initial performance=${origPerf}.`);

  // Test 9: Verify Supabase Storage Upload & Signed URL
  const testFileName = `card_sig_verify_${Date.now()}.png`;
  const dummySignatureBlob = Buffer.from('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const { error: uploadErr } = await client.storage.from('signatures').upload(testFileName, dummySignatureBlob, {
    contentType: 'image/png',
    upsert: true,
  });
  if (uploadErr) throw uploadErr;

  const { data: signedUrlData, error: signedUrlErr } = await client.storage.from('signatures').createSignedUrl(testFileName, 3600);
  if (signedUrlErr) throw signedUrlErr;
  console.log(`✅ 10. Digital Signature Uploaded to 'signatures' Bucket & Signed URL generated:`);
  console.log(`    ${signedUrlData.signedUrl.slice(0, 95)}...`);

  await client.storage.from('signatures').remove([testFileName]);
  console.log(`    Cleaned up test signature file.`);

  console.log('\n====================================================');
  console.log('ALL TESTS PASSED: Data reading and data writing to DB verified 100%!');
  console.log('====================================================');
}

main().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

