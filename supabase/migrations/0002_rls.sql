-- 0002_rls.sql
-- Row Level Security (RLS) & Role-Based Access Control

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table units enable row level security;
alter table athletes enable row level security;
alter table events enable row level security;
alter table heats enable row level security;
alter table heat_entries enable row level security;
alter table results enable row level security;
alter table prize_scale enable row level security;
alter table cash_cards enable row level security;

-- Helper: current user's role from profiles
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

-- Auto-create profile on auth signup
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Profiles Policies
create policy "Users can view all profiles"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Admins can manage profiles"
  on profiles for all
  using (public.current_role() = 'admin');

-- Units Policies
create policy "Everyone can view units"
  on units for select
  using (true);

create policy "Admins can manage units"
  on units for all
  using (public.current_role() = 'admin');

-- Athletes Policies
create policy "Everyone can view athletes"
  on athletes for select
  using (true);

create policy "Admins and officials can manage athletes"
  on athletes for all
  using (public.current_role() in ('admin', 'official'));

-- Events Policies
create policy "Everyone can view events"
  on events for select
  using (true);

create policy "Admins can manage events"
  on events for all
  using (public.current_role() = 'admin');

-- Heats Policies
create policy "Everyone can view heats"
  on heats for select
  using (true);

create policy "Officials and admins can manage heats"
  on heats for all
  using (public.current_role() in ('admin', 'official'));

-- Heat Entries Policies
create policy "Everyone can view heat entries"
  on heat_entries for select
  using (true);

create policy "Officials and admins can manage heat entries"
  on heat_entries for all
  using (public.current_role() in ('admin', 'official'));

-- Results Policies
create policy "Everyone can view results"
  on results for select
  using (true);

create policy "Officials and admins can manage results"
  on results for all
  using (public.current_role() in ('admin', 'official'));

-- Prize Scale Policies
create policy "Everyone can view prize scale"
  on prize_scale for select
  using (true);

create policy "Admins can manage prize scale"
  on prize_scale for all
  using (public.current_role() = 'admin');

-- Cash Cards Policies
create policy "Everyone can view cash cards"
  on cash_cards for select
  using (true);

create policy "Officials and admins can update cash cards"
  on cash_cards for update
  using (public.current_role() in ('admin', 'official'));

create policy "Admins can manage cash cards"
  on cash_cards for all
  using (public.current_role() = 'admin');

-- Storage Bucket for Signatures (Private)
insert into storage.buckets (id, name, public)
values ('signatures', 'signatures', false)
on conflict (id) do nothing;

create policy "Officials and admins can upload signatures"
  on storage.objects for insert
  with check (
    bucket_id = 'signatures' and
    (public.current_role() in ('admin', 'official') or auth.uid() is not null)
  );

create policy "Officials and admins can view signatures"
  on storage.objects for select
  using (
    bucket_id = 'signatures' and
    (public.current_role() in ('admin', 'official') or auth.uid() is not null)
  );

