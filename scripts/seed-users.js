const https = require('https');

const token = process.env.SUPABASE_ACCESS_TOKEN || '';
const projectRef = 'hwyzyzehewwwyvfbposd';

async function runQuery(sql) {
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
          resolve(body);
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
  console.log('Seeding Supabase auth users...');

  const sql = `
  create extension if not exists "pgcrypto";

  -- Clean up any existing records for these emails
  delete from auth.users where email in ('admin@hpcl.in', 'official@hpcl.in', 'viewer@hpcl.in');

  -- Define UUIDs
  do $$
  declare
    v_admin_id uuid := 'a0000000-0000-0000-0000-000000000001';
    v_official_id uuid := 'a0000000-0000-0000-0000-000000000002';
    v_viewer_id uuid := 'a0000000-0000-0000-0000-000000000003';
  begin
    -- Admin
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_admin_id,
      'authenticated',
      'authenticated',
      'admin@hpcl.in',
      crypt('Password@123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Meet Administrator"}',
      now(),
      now(),
      '',
      ''
    );

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      v_admin_id,
      v_admin_id,
      json_build_object('sub', v_admin_id::text, 'email', 'admin@hpcl.in')::jsonb,
      'email',
      'admin@hpcl.in',
      now(),
      now(),
      now()
    );

    -- Official
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_official_id,
      'authenticated',
      'authenticated',
      'official@hpcl.in',
      crypt('Password@123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Track Marshal"}',
      now(),
      now(),
      '',
      ''
    );

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      v_official_id,
      v_official_id,
      json_build_object('sub', v_official_id::text, 'email', 'official@hpcl.in')::jsonb,
      'email',
      'official@hpcl.in',
      now(),
      now(),
      now()
    );

    -- Viewer
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_viewer_id,
      'authenticated',
      'authenticated',
      'viewer@hpcl.in',
      crypt('Password@123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Guest Viewer"}',
      now(),
      now(),
      '',
      ''
    );

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      v_viewer_id,
      v_viewer_id,
      json_build_object('sub', v_viewer_id::text, 'email', 'viewer@hpcl.in')::jsonb,
      'email',
      'viewer@hpcl.in',
      now(),
      now(),
      now()
    );
  end $$;
  `;

  const res = await runQuery(sql);
  console.log('Query result:', res);

  // Check profiles
  const profilesRes = await runQuery('SELECT * FROM public.profiles;');
  console.log('Profiles in DB:', profilesRes);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
