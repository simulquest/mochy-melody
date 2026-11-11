-- =====================================================================
-- Coffre mystère : horaire des chutes décidé et mémorisé CÔTÉ SERVEUR.
-- =====================================================================
-- Pourquoi ? Si le délai d'apparition était calculé dans le navigateur,
-- il suffirait de fermer puis de rouvrir le site pour remettre le compteur
-- à zéro (première chute « rapide » de 30-90 s à chaque rechargement).
-- Désormais :
--   • la PREMIÈRE chute de la journée (30 à 90 s) est tirée UNE SEULE FOIS
--     par le serveur, à la première visite du jour, et mémorisée ici ;
--   • chaque chute MANQUÉE (coffre pas touché à temps, page fermée…) fait
--     re-planifier la suivante dans 2,5 à 6 min par le serveur ;
--   • rouvrir le site ne re-tire jamais le délai : le client récupère
--     simplement l'horaire déjà prévu (next_spawn_at) ;
--   • maximum 5 chutes manquées par jour : au-delà, plus de coffre avant
--     demain ;
--   • une fois la tentative quotidienne consommée (table
--     special_plush_attempts), plus aucun coffre ne tombe aujourd'hui.
--
-- ⚠️ À EXÉCUTER dans le SQL Editor de Supabase (« Run »), APRÈS
--    migration_special_plushes.sql et migration_special_plush_attempts.sql.
--    Ré-exécutable sans risque (idempotent).
-- =====================================================================

create table if not exists public.special_plush_chests (
  user_id       text not null references public.profiles(user_id) on delete cascade,
  day_key       text not null,
  -- Nombre de chutes manquées aujourd'hui (coffres pas touchés à temps).
  spawn_count   int not null default 0,
  -- Instant (UTC) de la prochaine chute du coffre.
  next_spawn_at timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  primary key (user_id, day_key)
);

alter table public.special_plush_chests enable row level security;
