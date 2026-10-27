-- =====================================================================
-- FIX : ouverture de caisse en rafale (coffres perdus + cartes doublonnées)
--
-- À COLLER DANS L'ÉDITEUR SQL SUPABASE puis exécuter.
--
-- Problème constaté : la route /api/lootbox/click calcule l'événement
-- ('open') sur une lecture de l'état, puis la fonction SQL ci-dessous
-- réappliquait cet événement à l'aveugle en relisant l'état elle-même.
-- Deux taps lancés avant la réponse (rafale de clics) produisaient donc
-- deux « open » : chaque requête en retard retirait encore 1 coffre et
-- crédait 1 carte en plus.
--   Ex. : 3 coffres accumulés → 1 ouverture → coffres = 0 (au lieu de 2)
--
-- Correctifs :
--   1) Un 'open' n'est applicable que si la caisse est RÉELLEMENT sur son
--      dernier clic (sinon il est rétrogradé en 'progress' : le coup compte,
--      aucun coffre n'est consommé, aucune carte n'est créditée).
--   2) Écriture conditionnelle (compare-and-swap) : l'UPDATE ne porte que si
--      l'état n'a pas changé depuis la lecture ; sinon l'événement est
--      abandonné et l'état réel est renvoyé ('locked').
--   3) market_grant_card n'est appelé QUE si la transition 'open' a
--      réellement eu lieu.
-- =====================================================================

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

  -- (1) Cohérence de l'événement : un 'open' calculé sur un état périmé
  --     (rafale de clics, deux onglets…) ne doit PAS consommer de coffre.
  if v_type = 'open' and (coalesce(st.progress, 0) + 1) < v_clicks then
    v_type := 'progress';
  end if;

  case v_type
    when 'upgrade' then
      -- (2) Écriture conditionnelle : on n'avance que si l'état est inchangé.
      update public.lootbox_state
      set rarity_idx = least(4, greatest(st.rarity_idx + 1, coalesce((p_event->>'newRarityIdx')::int, st.rarity_idx + 1))),
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
      v_new := least(4, greatest(st.rarity_idx + 1, coalesce((p_event->>'newRarityIdx')::int, st.rarity_idx + 1)));

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

      -- (2) Consomme UN coffre + remise à zéro, mais seulement si l'état
      --     est toujours celui qu'on vient de lire.
      update public.lootbox_state
      set rarity_idx       = 0,
          progress         = 0,
          chests_available = st.chests_available - 1,
          next_refill_at   = case
            when st.chests_available >= 3 and st.next_refill_at is null
              then now() + interval '4 minutes 30 seconds'
            else st.next_refill_at
          end,
          updated_at = now()
      where user_id = p_user_id
        and rarity_idx       = st.rarity_idx
        and progress         = st.progress
        and chests_available = st.chests_available;
      get diagnostics v_rows = row_count;

      -- (3) Course détectée : rien n'est appliqué, aucune carte n'est créditée.
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
