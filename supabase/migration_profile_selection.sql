-- =====================================================================
-- Migration « sélection de peluche » — à exécuter une fois dans le
-- SQL Editor du projet Supabase (Dashboard → SQL Editor → New query).
--
-- Ajoute la colonne profiles.selection : mémorise la peluche équipée
-- et la variante choisie dans chaque famille, synchronisée entre
-- appareils via GET/PUT /api/profile.
-- =====================================================================

alter table public.profiles add column if not exists selection jsonb;
