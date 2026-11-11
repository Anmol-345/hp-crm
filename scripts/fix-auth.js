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
  console.log('Fixing functions and auth.users columns...');

  const fixSql = `
  -- 1. Fix handle_new_user with explicit search_path and public.role_t
  create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
  as $$
  begin
    insert into public.profiles (id, full_name, role)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      case
        when new.email like '%admin%' then 'admin'::public.role_t
        when new.email like '%official%' or new.email like '%marshal%' then 'official'::public.role_t
        else 'viewer'::public.role_t
      end
    )
    on conflict (id) do update set
      full_name = excluded.full_name;
    return new;
  end;
  $$;

  -- 2. Fix current_role function
  create or replace function public.current_role()
  returns public.role_t
  language plpgsql
  security definer stable
  set search_path = public
  as $$
  declare
    v_role public.role_t;
  begin
    if auth.uid() is null then
      return 'viewer'::public.role_t;
    end if;
    select role into v_role from public.profiles where id = auth.uid();
    return coalesce(v_role, 'viewer'::public.role_t);
  end;
  $$;

  -- 3. Update auth.users so string columns scanned by Go are empty string instead of NULL
  update auth.users
  set
    email_change = coalesce(email_change, ''),
    email_change_token_new = coalesce(email_change_token_new, ''),
    email_change_token_current = coalesce(email_change_token_current, ''),
    phone_change = coalesce(phone_change, ''),
    phone_change_token = coalesce(phone_change_token, ''),
    recovery_token = coalesce(recovery_token, ''),
    confirmation_token = coalesce(confirmation_token, ''),
    reauthentication_token = coalesce(reauthentication_token, '');
  `;

  const res = await runQuery(fixSql);
  console.log('Fix applied:', res);
}

main().catch(err => {
  console.error('Error applying fix:', err);
  process.exit(1);
});

