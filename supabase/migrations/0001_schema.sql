-- 0001_schema.sql
-- 19th All India Annual Sports Meet 2024-25 (HPCL)
-- Core Database Schema

create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type gender_t as enum ('male', 'female', 'girl', 'boy');
exception when duplicate_object then null; end $$;

do $$ begin
  create type position_t as enum ('winner', 'runner_up', 'first_runner_up');
exception when duplicate_object then null; end $$;

do $$ begin
  create type metric_t as enum ('time_sec', 'distance_m');
exception when duplicate_object then null; end $$;

do $$ begin
  create type role_t as enum ('admin', 'official', 'viewer');
exception when duplicate_object then null; end $$;

-- 1. Profiles Table (Linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role role_t not null default 'viewer',
  created_at timestamptz default now()
);

-- 2. Units / Delegations ("Name of the Schools" on paper: refineries, zones, offices)
create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  kind text -- refinery | zone | office
);

-- 3. Athletes
create table if not exists athletes (
  id uuid primary key default gen_random_uuid(),
  bib_no int unique, -- BIB no on result sheets (nullable for cash-card-only entries)
  full_name text not null,
  gender gender_t,
  unit_id uuid references units(id) on delete set null,
  notes text,
  created_at timestamptz default now()
);

-- 4. Events
create table if not exists events (
  event_no int primary key,
  name text not null,
  category text not null,
  gender gender_t,
  age_min int,
  age_max int,
  metric metric_t not null default 'time_sec',
  event_date date,
  scheduled_time time,
  participants_count int,
  is_spouse boolean default false,
  meet_record text,
  created_at timestamptz default now()
);

-- 5. Heats (Official Record Sheets)
create table if not exists heats (
  id uuid primary key default gen_random_uuid(),
  event_no int references events(event_no) on delete cascade,
  heat_no int not null,
  time_recorded text,
  unique(event_no, heat_no)
);

-- 6. Heat Entries
create table if not exists heat_entries (
  id uuid primary key default gen_random_uuid(),
  heat_id uuid references heats(id) on delete cascade,
  bib_no int,
  athlete_id uuid references athletes(id) on delete set null,
  performance numeric(7,2),
  rank_remark text,
  needs_verification boolean default false,
  created_at timestamptz default now()
);

-- 7. Results
create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  event_no int references events(event_no) on delete cascade,
  position smallint check (position between 1 and 3),
  athlete_id uuid references athletes(id) on delete set null,
  performance numeric(7,2),
  result_date date,
  unique(event_no, position)
);

-- 8. Prize Scale (Winner ₹5000, Runner-up ₹4000, 1st Runner-up ₹3000)
create table if not exists prize_scale (
  position position_t primary key,
  amount_inr int not null
);

-- 9. Cash Cards Control Sheet (Format 3)
create table if not exists cash_cards (
  id uuid primary key default gen_random_uuid(),
  serial_no int unique not null, -- row number on Format 3 sheet (1–36)
  event_no int references events(event_no),
  position position_t not null,
  athlete_id uuid references athletes(id) on delete set null,
  amount_inr int not null,
  signed boolean default false,
  signed_at timestamptz,
  signature_path text, -- storage path in 'signatures' bucket
  remark text,
  unique(event_no, position)
);

-- 10. Medal Table View
create or replace view medal_table as
select
  u.name as unit,
  count(*) filter (where r.position = 1) as gold,
  count(*) filter (where r.position = 2) as silver,
  count(*) filter (where r.position = 3) as bronze,
  count(*) filter (where r.position between 1 and 3) as total_medals,
  (count(*) filter (where r.position = 1) * 5 +
   count(*) filter (where r.position = 2) * 3 +
   count(*) filter (where r.position = 3) * 1) as total_points
from results r
join athletes a on a.id = r.athlete_id
join units u on u.id = a.unit_id
group by u.name;

-- Trigger: Auto-populate amount_inr from prize_scale if not provided
create or replace function set_cash_card_amount()
returns trigger as $$
begin
  if new.amount_inr is null or new.amount_inr = 0 then
    select amount_inr into new.amount_inr
    from prize_scale
    where position = new.position;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_cash_card_amount on cash_cards;
create trigger trg_set_cash_card_amount
before insert or update of position on cash_cards
for each row execute function set_cash_card_amount();

-- Function: publish_results(event_no)
-- Automatically creates/updates the 3 cash-card rows when results are finalized for events 1-12
create or replace function publish_results(p_event_no int)
returns void as $$
declare
  r record;
  v_pos position_t;
  v_serial int;
  v_amount int;
begin
  -- Cash cards apply only to events 1 through 12
  if p_event_no < 1 or p_event_no > 12 then
    return;
  end if;

  for r in (
    select position, athlete_id
    from results
    where event_no = p_event_no
    order by position asc
  ) loop
    if r.position = 1 then
      v_pos := 'winner';
      v_serial := (p_event_no - 1) * 3 + 1;
    elsif r.position = 2 then
      v_pos := 'runner_up';
      v_serial := (p_event_no - 1) * 3 + 2;
    elsif r.position = 3 then
      v_pos := 'first_runner_up';
      v_serial := (p_event_no - 1) * 3 + 3;
    end if;

    select amount_inr into v_amount from prize_scale where position = v_pos;

    insert into cash_cards (serial_no, event_no, position, athlete_id, amount_inr, signed)
    values (v_serial, p_event_no, v_pos, r.athlete_id, coalesce(v_amount, 0), false)
    on conflict (event_no, position) do update set
      athlete_id = excluded.athlete_id,
      amount_inr = excluded.amount_inr;
  end loop;
end;
$$ language plpgsql;

