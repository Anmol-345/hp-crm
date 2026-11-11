const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const token = process.env.SUPABASE_ACCESS_TOKEN || '';
const projectRef = process.env.SUPABASE_PROJECT_REF || 'hwyzyzehewwwyvfbposd';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hwyzyzehewwwyvfbposd.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function runSqlQuery(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${projectRef}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve(body);
          }
        } else {
          reject(new Error(`Status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== 1. VERIFYING ROWS IN DATABASE (SQL DIRECT) ===');
  const countSql = `
    SELECT 'units' as tbl, count(*) as count FROM units
    UNION ALL SELECT 'athletes', count(*) FROM athletes
    UNION ALL SELECT 'events', count(*) FROM events
    UNION ALL SELECT 'heats', count(*) FROM heats
    UNION ALL SELECT 'heat_entries', count(*) FROM heat_entries
    UNION ALL SELECT 'results', count(*) FROM results
    UNION ALL SELECT 'prize_scale', count(*) FROM prize_scale
    UNION ALL SELECT 'cash_cards', count(*) FROM cash_cards
    UNION ALL SELECT 'profiles', count(*) FROM profiles
    UNION ALL SELECT 'medal_table', count(*) FROM medal_table;
  `;
  const counts = await runSqlQuery(countSql);
  console.table(counts);

  console.log('\n=== 2. VERIFYING ANONYMOUS CLIENT READ VIA SUPABASE SDK ===');
  const anonClient = createClient(supabaseUrl, anonKey);
  
  const tables = ['events', 'units', 'athletes', 'heats', 'results', 'cash_cards'];
  for (const t of tables) {
    const { data, error, count } = await anonClient.from(t).select('*', { count: 'exact', head: false }).limit(3);
    if (error) {
      console.log(`❌ Table '${t}' anon read FAILED:`, error.message);
    } else {
      console.log(`✅ Table '${t}' anon read SUCCESS: ${data.length} sample rows returned. First item:`, data[0] ? (data[0].name || data[0].full_name || data[0].serial_no || data[0].event_no || data[0].id) : 'empty');
    }
  }

  console.log('\n=== 3. VERIFYING AUTHENTICATED OFFICIAL SIGN-IN & PERMISSIONS ===');
  const officialClient = createClient(supabaseUrl, anonKey);
  const { data: authData, error: authError } = await officialClient.auth.signInWithPassword({
    email: 'official@hpcl.in',
    password: 'Password@123',
  });

  if (authError) {
    console.log('❌ Official login failed:', authError.message);
  } else {
    console.log('✅ Official login SUCCESS. User ID:', authData.user.id);
    const { data: profile } = await officialClient.from('profiles').select('*').eq('id', authData.user.id).single();
    console.log('Profile role:', profile);

    // Test writing to DB: Update heat_entries
    console.log('\n=== 4. TEST WRITING TO DATABASE (OFFICIAL ROLE) ===');
    const { data: sampleEntry, error: sampleErr } = await officialClient.from('heat_entries').select('id, performance, rank_remark').limit(1).single();
    if (sampleEntry) {
      console.log('Sample entry before update:', sampleEntry);
      const testPerf = (Math.random() * 2 + 12).toFixed(2);
      const { data: updatedEntry, error: updateErr } = await officialClient
        .from('heat_entries')
        .update({ performance: parseFloat(testPerf) })
        .eq('id', sampleEntry.id)
        .select()
        .single();

      if (updateErr) {
        console.log('❌ Heat entry update FAILED:', updateErr.message);
      } else {
        console.log(`✅ Heat entry update SUCCESS! ID: ${updatedEntry.id}, New performance: ${updatedEntry.performance}`);
      }
    }

    // Test writing to cash_cards: sign / unsign
    const { data: sampleCard, error: cardFetchErr } = await officialClient.from('cash_cards').select('serial_no, signed, signed_at').limit(1).single();
    if (sampleCard) {
      console.log('\nSample cash card before update:', sampleCard);
      const newSignedState = !sampleCard.signed;
      const { data: updatedCard, error: cardUpdateErr } = await officialClient
        .from('cash_cards')
        .update({ signed: newSignedState, signed_at: newSignedState ? new Date().toISOString() : null })
        .eq('serial_no', sampleCard.serial_no)
        .select()
        .single();

      if (cardUpdateErr) {
        console.log('❌ Cash card update FAILED:', cardUpdateErr.message);
      } else {
        console.log(`✅ Cash card update SUCCESS! Serial ${updatedCard.serial_no}, signed: ${updatedCard.signed}, signed_at: ${updatedCard.signed_at}`);
        // Restore previous state
        await officialClient
          .from('cash_cards')
          .update({ signed: sampleCard.signed, signed_at: sampleCard.signed_at })
          .eq('serial_no', sampleCard.serial_no);
        console.log('Restored cash card to initial state.');
      }
    }

    // Test Storage Bucket 'signatures'
    console.log('\n=== 5. TEST STORAGE BUCKET (SIGNATURES) ===');
    const testFile = Buffer.from('test signature image data');
    const fileName = `test_sig_${Date.now()}.png`;
    const { error: uploadError } = await officialClient.storage.from('signatures').upload(fileName, testFile, {
      contentType: 'image/png',
      upsert: true,
    });
    if (uploadError) {
      console.log('❌ Signature upload FAILED:', uploadError.message);
    } else {
      console.log('✅ Signature upload SUCCESS:', fileName);
      const { data: signedUrlData } = await officialClient.storage.from('signatures').createSignedUrl(fileName, 60);
      console.log('✅ Signed URL generated:', signedUrlData?.signedUrl ? 'OK' : 'None');
      await officialClient.storage.from('signatures').remove([fileName]);
      console.log('Cleaned up test signature.');
    }
  }
}

main().catch(console.error);
