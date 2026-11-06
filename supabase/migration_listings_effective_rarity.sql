-- Rareté EFFECTIVE des annonces = max(coffre d'origine, mutation portée).
--
-- Le filtre « Commun / Rare / … » du marché doit correspondre exactement aux
-- badges affichés sur les cartes (les badges utilisent la rareté effective :
-- une peluche issue d'un coffre Commune avec des yeux Améthyste est ÉPIQUE).
-- Colonne GÉNÉRÉE : toujours à jour, aucun trigger ni backfill nécessaire.
--
-- À coller tel quel dans le SQL Editor de Supabase, puis « Run ».

alter table public.listings
  add column if not exists effective_rarity_idx int
  generated always as (
    greatest(
      coalesce(rarity_idx, 0),
      case mutation->'eye'->>'rarity'
        when 'rare' then 1 when 'epique' then 2
        when 'legendaire' then 3 when 'mythique' then 4 else 0 end,
      case mutation->'fur'->>'rarity'
        when 'rare' then 1 when 'epique' then 2
        when 'legendaire' then 3 when 'mythique' then 4 else 0 end,
      case mutation->'tint'->>'rarity'
        when 'rare' then 1 when 'epique' then 2
        when 'legendaire' then 3 when 'mythique' then 4 else 0 end,
      case when coalesce(mutation->'hetero', 'null'::jsonb) <> 'null'::jsonb
        then 1 else 0 end
    )
  ) stored;

create index if not exists listings_effective_rarity_idx
  on public.listings (effective_rarity_idx);
