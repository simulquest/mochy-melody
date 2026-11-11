-- =====================================================================
-- Plafond de rareté des coffres : base_rarity_idx.
-- =====================================================================
-- Règle : un coffre ne peut jamais dépasser UN cran au-dessus de sa rareté
-- d'origine — un coffre Commune plafonne à Rare, un Rare à Épique, un Épique
-- à Légendaire, un Légendaire à Mythique (et Mythique reste Mythique).
--
-- Concrètement :
--   1. colonne `lootbox_state.base_rarity_idx` : rareté d'origine du coffre
--      courant (0 = Commune, le défaut pour les coffres en recharge) ;
--   2. `lootbox_click` : les montées de rareté sont bornées à
--      base_rarity_idx + 1, et une ouverture repart sur un coffre Commune
--      (base 0) ;
--   3. `lootbox_import_state` : l'import d'une progression locale considère
--      la rareté importée comme la rareté d'origine du coffre.
--
-- Le miroir TS (src/lib/plush/lootbox.ts → maxRarityForChest, appliqué par
-- lootbox-engine.ts) partage exactement la même règle.
--
-- ⚠️ À EXÉCUTER dans le SQL Editor de Supabase (« Run »).
--    Ré-exécutable sans risque (idempotent).
-- =====================================================================

-- 1) Rareté d'origine du coffre courant.
alter table public.lootbox_state
  add column if not exists base_rarity_idx int not null default 0;

update public.lootbox_state
   set base_rarity_idx = 0
 where base_rarity_idx is null;

-- 2) La fonction de clic applique le plafond (miroir SQL de maxRarityForChest).
create or replace function public.lootbox_click(
  p_user_id text,
  p_event   jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  st        public.lootbox_state;
  v_type    text := p_event->>'type';
  v_clicks  int;
  v_cap     int;
  v_rows    int;
  v_new     int := null;
  won       jsonb := null;
begin
  perform public.market_ensure_profile(p_user_id);
  st := public.lootbox_ensure_state(p_user_id);
  -- Sérialise les clics d'un même utilisateur avant de valider la transition.
  select * into st
    from public.lootbox_state
   where user_id = p_user_id
     for update;

  if st.chests_available <= 0 and v_type not in ('progress', 'upgrade') then
    return jsonb_build_object('type', 'locked', 'persist', to_jsonb(st));
  end if;

  -- Clics requis pour la rareté courante (miroir de RARITIES côté TS).
  v_clicks := case coalesce(st.rarity_idx, 0)
                when 0 then 3
                when 1 then 6
                when 2 then 10
                when 3 then 16
                else 24
              end;

  -- Plafond de rareté : UN cran au-dessus de la rareté d'origine du coffre.
  v_cap := least(4, coalesce(st.base_rarity_idx, 0) + 1);

  -- Un 'upgrade' au-delà du plafond est rétrogradé en simple progression.
  if v_type = 'upgrade' and coalesce(st.rarity_idx, 0) >= v_cap then
    v_type := 'progress';
  end if;

  -- Un 'open' calculé sur un état périmé ne doit PAS consommer de coffre.
  if v_type = 'open' and (coalesce(st.progress, 0) + 1) < v_clicks then
    v_type := 'progress';
  end if;

  case v_type
    when 'upgrade' then
      update public.lootbox_state
      set rarity_idx = least(v_cap,
                             greatest(st.rarity_idx + 1,
                                      coalesce((p_event->>'newRarityIdx')::int, st.rarity_idx + 1))),
          progress   = st.progress + 1,
          updated_at = now()
      where user_id = p_user_id
        and rarity_idx       = st.rarity_idx
        and progress         = st.progress
        and chests_available = st.chests_available;
      get diagnostics v_rows = row_count;
      if v_rows = 0 then
        return jsonb_build_object('type', 'locked', 'persist', to_jsonb(public.lootbox_ensure_state(p_user_id)));
      end if;
      v_new := least(v_cap,
                     greatest(st.rarity_idx + 1,
                              coalesce((p_event->>'newRarityIdx')::int, st.rarity_idx + 1)));

    when 'progress' then
      update public.lootbox_state
      set progress   = st.progress + 1,
          updated_at = now()
      where user_id = p_user_id
        and rarity_idx       = st.rarity_idx
        and progress         = st.progress
        and chests_available = st.chests_available;
      get diagnostics v_rows = row_count;
      if v_rows = 0 then
        return jsonb_build_object('type', 'locked', 'persist', to_jsonb(public.lootbox_ensure_state(p_user_id)));
      end if;

    when 'open' then
      if st.chests_available <= 0 then
        return jsonb_build_object('type', 'locked', 'persist', to_jsonb(st));
      end if;
      if p_event->'card' is null or p_event->'card' = 'null'::jsonb then
        raise exception 'carte manquante pour une ouverture';
      end if;

      -- consomme UN coffre + remise à zéro, seulement si l'état est inchangé
      update public.lootbox_state
      set rarity_idx       = 0,
          progress         = 0,
          base_rarity_idx  = 0, -- le prochain coffre repart de Commune
          chests_available = st.chests_available - 1,
          next_refill_at   = case
            when st.chests_available >= 5 and st.next_refill_at is null
              then now() + interval '4 minutes 30 seconds'
            else st.next_refill_at
          end,
          updated_at = now()
      where user_id = p_user_id
        and rarity_idx       = st.rarity_idx
        and progress         = st.progress
        and chests_available = st.chests_available;
      get diagnostics v_rows = row_count;

      -- course détectée : rien d'appliqué, aucune carte créditée
      if v_rows = 0 then
        return jsonb_build_object('type', 'locked', 'persist', to_jsonb(public.lootbox_ensure_state(p_user_id)));
      end if;

      won := p_event->'card';
      perform public.market_grant_card(jsonb_build_object(
        'user_id',      p_user_id,
        'card_id',      won->>'id',
        'card_name',    won->>'name',
        'species_id',   won->>'speciesId',
        'rarity_idx',   coalesce((won->>'rarityIdx')::int, 0),
        'preset',       won->'preset',
        'mutation',     nullif(won->'mutation', 'null'::jsonb),
        'mutation_key', coalesce(won->>'mutationKey', 'none'),
        'quantity',     1
      ));

    else
      raise exception 'type d''événement inconnu : %', v_type;
  end case;

  return jsonb_build_object(
    'type', v_type,
    'new_rarity_idx', v_new,
    'won', won,
    'persist', to_jsonb(public.lootbox_ensure_state(p_user_id))
  );
end;
$$;

revoke all on function public.lootbox_click(text, jsonb) from public, anon, authenticated;
grant execute on function public.lootbox_click(text, jsonb) to service_role;

-- 3) L'import d'une progression locale fixe la rareté d'origine du coffre.
create or replace function public.lootbox_import_state(
  p_user_id        text,
  p_rarity_idx     int,
  p_progress       int,
  p_chests         int,
  p_next_refill_ms bigint
)
returns public.lootbox_state
language plpgsql security definer set search_path = public
as $$
declare
  st public.lootbox_state;
  rf record;
begin
  perform public.market_ensure_profile(p_user_id);
  st := public.lootbox_ensure_state(p_user_id);

  -- N'importe que si l'état serveur est encore vierge (aucune partie jouée).
  if st.rarity_idx = 0 and st.progress = 0 and st.chests_available <= 1 then
    st.rarity_idx       := greatest(0, least(4, coalesce(p_rarity_idx, 0)));
    st.progress         := greatest(0, coalesce(p_progress, 0));
    st.chests_available := greatest(0, least(5, coalesce(p_chests, st.chests_available)));
    st.base_rarity_idx  := st.rarity_idx; -- la rareté importée = rareté d'origine
    if p_next_refill_ms is not null and p_next_refill_ms > 0 then
      st.next_refill_at := to_timestamp(p_next_refill_ms / 1000.0);
    else
      st.next_refill_at := null;
    end if;

    select * into rf from public.lootbox_apply_refills(
      st.rarity_idx, st.progress, st.chests_available, st.next_refill_at);

    update public.lootbox_state
    set rarity_idx       = rf.rarity_idx,
        progress         = rf.progress,
        chests_available = rf.chests_available,
        next_refill_at   = rf.next_refill_at,
        base_rarity_idx  = st.base_rarity_idx,
        updated_at       = now()
    where user_id = p_user_id;
  end if;

  return public.lootbox_ensure_state(p_user_id);
end;
$$;
