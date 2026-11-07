-- =====================================================================
-- Annulation d'une enchère par l'enchérisseur (même en tête).
-- =====================================================================
-- Contexte : dans « Mes enchères », l'utilisateur peut ouvrir le détail
-- d'une de ses mises encore en cours et l'annuler → les MochyCoins
-- bloqués (escrow) lui sont rendus.
--
-- Règles :
--   • seule la mise ACTIVE du joueur sur la vente peut être annulée ;
--   • impossible d'annuler une vente terminée / non active ;
--   • la mise EN TÊTE peut aussi être annulée : le second enchérisseur
--     redevient alors premier. Ses coins avaient déjà été rendus au
--     moment où il a été dépassé, donc ils sont re-bloqués (escrow) :
--       - s'il ne peut plus se payer sa propre mise, elle est retirée
--         (statut « refunded ») et on passe au suivant ;
--       - si personne ne peut plus se payer sa mise, la vente repart du
--         prix de départ sans enchérisseur en tête.
--
-- ⚠️ Version 2 : à RE-EXÉCUTER dans le SQL Editor de Supabase (« Run »)
--    pour remplacer l'ancienne version qui interdisait l'annulation
--    d'une mise en tête.
-- =====================================================================

create or replace function public.market_cancel_bid(
  p_user_id text,
  p_bid_id  uuid
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  bid      public.bids;
  lst      public.listings;
  nxt      record;
  v_leader text;
  v_price  bigint;
begin
  -- 1) La mise doit exister et appartenir au joueur.
  select * into bid
  from public.bids
  where id = p_bid_id and bidder_id = p_user_id
  for update;

  if not found then
    raise exception 'Enchère introuvable';
  end if;

  if bid.status <> 'active' then
    raise exception 'Cette mise n''est plus active';
  end if;

  -- 2) La vente doit encore être en cours.
  select * into lst
  from public.listings
  where id = bid.listing_id
  for update;

  if not found then
    raise exception 'Vente introuvable';
  end if;

  if lst.status <> 'active' or lst.ends_at <= now() then
    raise exception 'Cette enchère est terminée';
  end if;

  -- 3) Rembourse les coins bloqués et marque la mise remboursée.
  update public.profiles
  set coins = coins + bid.amount, updated_at = now()
  where user_id = p_user_id;

  update public.bids
  set status = 'refunded'
  where id = bid.id;

  -- 4) Si la mise annulée était en tête : le second enchérisseur devient
  --    premier. Ses coins avaient déjà été rendus quand il a été dépassé,
  --    donc on les re-bloque ; s'il ne peut plus se payer sa mise, elle
  --    est retirée et on descend au suivant.
  v_leader := null;
  v_price  := null;
  if lst.highest_bidder_id = p_user_id then
    for nxt in
      select b.id, b.bidder_id, b.amount
      from public.bids b
      where b.listing_id = lst.id
        and b.status = 'outbid'
        and b.bidder_id <> p_user_id
      order by b.amount desc, b.created_at asc
    loop
      -- Re-escrow : ne passe que si le joueur a encore assez de coins.
      update public.profiles
      set coins = coins - nxt.amount, updated_at = now()
      where user_id = nxt.bidder_id and coins >= nxt.amount;

      if found then
        update public.bids
        set status = 'active'
        where id = nxt.id;

        v_leader := nxt.bidder_id;
        v_price  := nxt.amount;
        exit;
      end if;

      -- Plus assez de coins : mise retirée (coins déjà remboursés au
      -- moment où il a été dépassé), on essaie la mise suivante.
      update public.bids
      set status = 'refunded'
      where id = nxt.id;
    end loop;

    -- Personne en tête → la vente repart du prix de départ.
    update public.listings
    set highest_bidder_id = v_leader,
        current_price     = coalesce(v_price, lst.starting_price)
    where id = lst.id;
  end if;

  return jsonb_build_object(
    'listing_id',    lst.id,
    'bid_id',        bid.id,
    'refunded',      bid.amount,
    'new_leader_id', v_leader,
    'new_price',     v_price
  );
end;
$$;
