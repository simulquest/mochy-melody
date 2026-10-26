-- ===========================================================================
-- CORRECTION : market_place_bid
-- Le solde était contrôlé AVANT le remboursement de la mise précédente :
-- surenchérir sur sa propre mise échouait à tort (« Solde insuffisant »).
-- À exécuter dans le SQL Editor Supabase (idempotent, aucun risque de perte).
-- ===========================================================================

create or replace function public.market_place_bid(
  p_user_id    text,
  p_listing_id uuid,
  p_amount     bigint
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  lst       public.listings;
  bidder    public.profiles;
  prev_bid  text;
  prev_amt  bigint;
  min_amt   bigint;
begin
  if p_amount is null or p_amount < 1 then
    raise exception 'Montant invalide';
  end if;

  select * into lst
  from public.listings
  where id = p_listing_id
  for update;

  if not found then
    raise exception 'Enchère introuvable';
  end if;

  if lst.status <> 'active' or lst.ends_at <= now() then
    perform public.market_settle_expired();
    select * into lst from public.listings where id = p_listing_id;
    if lst.status <> 'active' then
      raise exception 'Cette enchère vient de se terminer';
    end if;
  end if;

  if lst.seller_id = p_user_id then
    raise exception 'Vous ne pouvez pas enchérir sur votre propre vente';
  end if;

  min_amt := case
    when lst.highest_bidder_id is null then lst.current_price
    else lst.current_price + 1
  end;

  if p_amount < min_amt then
    raise exception 'Enchère minimale : % MochyCoins', min_amt;
  end if;

  select * into bidder from public.profiles where user_id = p_user_id for update;
  if not found then
    raise exception 'Profil introuvable';
  end if;

  prev_bid := lst.highest_bidder_id;
  prev_amt := lst.current_price;

  -- rembourse l'ancien meilleur (possiblement soi-même si re-enchère)
  if prev_bid is not null then
    update public.profiles
    set coins = coins + prev_amt, updated_at = now()
    where user_id = prev_bid;

    update public.bids
    set status = 'outbid'
    where listing_id = p_listing_id and bidder_id = prev_bid and status = 'active';

    -- re-enchère sur sa propre mise : les coins remboursés redeviennent
    -- disponibles AVANT de contrôler le solde.
    if prev_bid = p_user_id then
      bidder.coins := bidder.coins + prev_amt;
    end if;
  end if;

  if bidder.coins < p_amount then
    raise exception 'Solde insuffisant (% disponibles, % requis)',
      bidder.coins, p_amount;
  end if;

  -- bloque les coins du nouvel enchérisseur
  update public.profiles
  set coins = coins - p_amount, updated_at = now()
  where user_id = p_user_id;

  update public.listings
  set current_price     = p_amount,
      highest_bidder_id = p_user_id,
      bid_count         = bid_count + 1
  where id = p_listing_id;

  insert into public.bids (listing_id, bidder_id, amount)
  values (p_listing_id, p_user_id, p_amount);

  return jsonb_build_object(
    'listing_id',       p_listing_id,
    'current_price',    p_amount,
    'highest_bidder_id', p_user_id,
    'bid_count',        (select bid_count from public.listings where id = p_listing_id)
  );
end;
$$;
