-- First-time player onboarding and five welcome chests.
-- Run once in the Supabase SQL Editor for an existing project.

begin;

alter table public.profiles
  add column if not exists onboarding_completed boolean not null default true;
update public.profiles set onboarding_completed = true;
alter table public.profiles
  alter column onboarding_completed set default false;

alter table public.lootbox_state
  alter column chests_available set default 5;
alter table public.lootbox_state
  drop constraint if exists lootbox_state_chests_available_check;
alter table public.lootbox_state
  add constraint lootbox_state_chests_available_check
  check (chests_available between 0 and 5);

create or replace function public.market_ensure_profile(
  p_user_id    text,
  p_user_name  text default null,
  p_avatar_url text default null
)
returns public.profiles
language plpgsql security definer set search_path = public
as $$
declare
  prof public.profiles;
  v_created int;
begin
  if p_user_id is null or length(trim(p_user_id)) = 0 then
    raise exception 'user_id manquant';
  end if;

  insert into public.profiles (user_id, display_name, avatar_url, onboarding_completed)
  values (
    p_user_id,
    coalesce(nullif(trim(p_user_name), ''), 'Plushie'),
    nullif(p_avatar_url, ''),
    false
  )
  on conflict (user_id) do nothing;
  get diagnostics v_created = row_count;

  if v_created = 0 then
    update public.profiles
    set display_name = coalesce(nullif(trim(p_user_name), ''), display_name),
        avatar_url   = coalesce(nullif(p_avatar_url, ''), avatar_url),
        updated_at   = now()
    where user_id = p_user_id;
  else
    insert into public.lootbox_state (user_id, chests_available)
    values (p_user_id, 5)
    on conflict (user_id) do nothing;
  end if;

  select * into prof from public.profiles where user_id = p_user_id;
  return prof;
end;
$$;

create or replace function public.lootbox_apply_refills(
  p_rarity       int,
  p_progress     int,
  p_chests       int,
  p_next_refill  timestamptz
)
returns table (rarity_idx int, progress int, chests_available int, next_refill_at timestamptz)
language plpgsql set search_path = public
as $$
declare
  v_chests int := p_chests;
  v_next   timestamptz := p_next_refill;
  v_now    timestamptz := now();
begin
  if v_chests >= 5 then
    return query select p_rarity, p_progress, 5, null::timestamptz;
    return;
  end if;

  if v_next is null then
    v_next := v_now + interval '4 minutes 30 seconds';
  end if;

  while v_next <= v_now and v_chests < 5 loop
    v_chests := v_chests + 1;
    v_next   := v_next + interval '4 minutes 30 seconds';
  end loop;

  if v_chests >= 5 then
    v_next := null;
  end if;

  return query select p_rarity, p_progress, v_chests, v_next;
end;
$$;

-- Update existing transaction functions without changing their other logic.
do $$
declare
  v_definition text;
  v_updated text;
begin
  v_definition := pg_get_functiondef('public.lootbox_import_state(text,integer,integer,integer,bigint)'::regprocedure);
  v_updated := replace(
    v_definition,
    'least(3, coalesce(p_chests, st.chests_available))',
    'least(5, coalesce(p_chests, st.chests_available))'
  );
  if v_updated = v_definition and position('least(5, coalesce(p_chests, st.chests_available))' in v_definition) = 0 then
    raise exception 'Unable to update chest limit in lootbox_import_state';
  end if;
  if v_updated <> v_definition then execute v_updated; end if;

  v_definition := pg_get_functiondef('public.lootbox_click(text,jsonb)'::regprocedure);
  v_updated := replace(
    v_definition,
    'when st.chests_available >= 3 and st.next_refill_at is null',
    'when st.chests_available >= 5 and st.next_refill_at is null'
  );
  if v_updated = v_definition and position('when st.chests_available >= 5 and st.next_refill_at is null' in v_definition) = 0 then
    raise exception 'Unable to update refill start condition in lootbox_click';
  end if;
  if v_updated <> v_definition then execute v_updated; end if;
end;
$$;

commit;
