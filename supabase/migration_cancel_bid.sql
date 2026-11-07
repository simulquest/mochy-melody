-- =====================================================================
-- Annulation d'une enchère par l'enchérisseur.
-- =====================================================================
-- Contexte : dans « Mes enchères », l'utilisateur peut ouvrir le détail
-- d'une de ses mises encore en cours. S'il a été dépassé, il peut :
--   • annuler sa mise → les MochyCoins bloqués (escrow) lui sont rendus ;
--   • ou renchérir pour repasser en tête.
--
-- Règles :
--   • seule la mise ACTIVE du joueur sur la vente peut être annulée ;
--   • impossible d'annuler une vente terminée / non active ;
--   • impossible d'annuler la mise EN TÊTE : les enchérisseurs précédents
--     ont déjà été remboursés, on ne peut pas restaurer leur escrow de
--     façon fiable (leur solde a pu être dépensé entre-temps). Règle
--     standard des enchères : on ne rétracte pas la meilleure offre.
--
-- À coller tel quel dans le SQL Editor de Supabase, puis « Run ».
-- =====================================================================

create or replace function public.market_cancel_bid(
  p_user_id text,
  p_bid_id  uuid
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  bid public.bids;
  lst public.listings;
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

  -- 3) Interdiction d'annuler la meilleure offre.
  if lst.highest_bidder_id = p_user_id then
    raise exception 'Vous êtes en tête : cette mise ne peut pas être annulée';
  end if;

  -- 4) Rembourse les coins bloqués et marque la mise remboursée.
  update public.profiles
  set coins = coins + bid.amount, updated_at = now()
  where user_id = p_user_id;

  update public.bids
  set status = 'refunded'
  where id = bid.id;

  return jsonb_build_object(
    'listing_id', lst.id,
    'bid_id',     bid.id,
    'refunded',   bid.amount
  );
end;
$$;
