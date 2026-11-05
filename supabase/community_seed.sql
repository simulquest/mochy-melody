-- =====================================================================
-- Community — SEED compact v2 (30 scènes fictives, 361 votes, commentaires)
-- Les objets 3D sont générés par Postgres (random) : fichier léger, collable
-- entier dans le SQL Editor. Idempotent : relançable sans dupliquer.
-- =====================================================================

-- 1) Profils simulés ------------------------------------------------------
insert into public.profiles (user_id, display_name) values
  ('bot_luna','Luna'),
  ('bot_maxou27','Maxou27'),
  ('bot_chachou','Chachou'),
  ('bot_nougatine','Nougatine'),
  ('bot_mlodye','Mélodye'),
  ('bot_tofu','Tofu'),
  ('bot_brume','Brume'),
  ('bot_ziggy','Ziggy'),
  ('bot_caramelou','Caramelou'),
  ('bot_pixie','Pixie'),
  ('bot_rafale','Rafale'),
  ('bot_minouche','Minouche'),
  ('bot_gloub','Gloub'),
  ('bot_nebula','Nebula'),
  ('bot_kiwano','Kiwano'),
  ('bot_pomeline','Pomeline'),
  ('bot_sirocco','Sirocco'),
  ('bot_tutti','Tutti'),
  ('bot_pastel','Pastel'),
  ('bot_oxygne','Oxygène'),
  ('bot_pastque','Pastèque'),
  ('bot_quartz','Quartz'),
  ('bot_roudoudou','Roudoudou'),
  ('bot_sleepy','Sleepy'),
  ('bot_twinkle','Twinkle'),
  ('bot_vanille','Vanille'),
  ('bot_wombat','Wombat'),
  ('bot_xnon','Xénon'),
  ('bot_yuzu','Yuzu'),
  ('bot_zphyr','Zéphyr'),
  ('bot_ambroisie','Ambroisie'),
  ('bot_biscotte','Biscotte'),
  ('bot_cloudine','Cloudine'),
  ('bot_dorayaki','Dorayaki'),
  ('bot_clair','Éclair'),
  ('bot_fanfare','Fanfare'),
  ('bot_goyave','Goyave'),
  ('bot_hibiscus','Hibiscus'),
  ('bot_isotope','Isotope'),
  ('bot_jubilee','Jubilee'),
  ('bot_kakigori','Kakigori'),
  ('bot_mochimellow','Mochimellow'),
  ('bot_neon','Neon'),
  ('bot_opaline','Opaline'),
  ('bot_praline','Praline')
on conflict (user_id) do nothing;

-- 2) 30 scènes publiées (objets 3D générés par SQL) ------------------------
with sp(id, pid, pname, root, tip, body, glow) as (values
  ('souris-nuit','souris-nuit','Souris Nuit','#33254a','#c9b8f2','#7a6ab0','#a891f2'),
  ('ours-caramel','ours-caramel','Ours Caramel','#6a4a1a','#ffd9a8','#c98a4b','#ffb56b'),
  ('fantome','piou','Piou Fantôme','#6f93c8','#e6f4ff','#aecdf2','#9cc2ff'),
  ('tigre-sable','tigre-sable','Tigre Sable','#8a5a2a','#f5e0b8','#d9b478','#f0d09c'),
  ('cochon-truffe','cochon-truffe','Cochon Truffe','#3a2014','#c99a78','#8a5a3a','#c98a5c'),
  ('hibou-lunaire','hibou-lunaire','Hibou Lunaire','#1a2a3a','#d1e0ff','#4a6a8a','#a8c9ff'),
  ('hibou-noisette','hibou-noisette','Hibou Noisette','#4a3a24','#d9c0a8','#8a6a4a','#c9a87a'),
  ('ours-polaire','ours-polaire','Ours Polaire','#4a6a7a','#ffffff','#cfe6f0','#a8e0ff'),
  ('ours-chocolat','ours-chocolat','Ours Chocolat','#4a2a18','#d9b08f','#8a5a3a','#c98a5c'),
  ('canard-rose','canard-rose','Canard Roseau','#8a4a5a','#ffd0de','#f098b5','#ffb8ce'),
  ('singe-banane','singe-banane','Singe Banane','#6a4a22','#ffe08f','#d9a84a','#ffcf6a'),
  ('renard-braise','renard-braise','Renard Braise','#6a160d','#ffb08f','#e0432a','#ff7a3d')
),
inp(uid, title, theme, spid, votes) as (values
  ('bot_luna','Prairie enchantée','prairie','souris-nuit',34),
  ('bot_maxou27','Boss fleurie','prairie','ours-caramel',29),
  ('bot_chachou','Nuit étoilée','nuit','fantome',27),
  ('bot_nougatine','Disco sous les étoiles','nuit','tigre-sable',24),
  ('bot_mlodye','Royaume des neiges','neige','cochon-truffe',22),
  ('bot_tofu','Bonhomme solitaire','neige','hibou-lunaire',19),
  ('bot_brume','Plage privée','plage','hibou-noisette',18),
  ('bot_ziggy','Coucher de soleil','plage','ours-polaire',16),
  ('bot_caramelou','Clairière secrète','foret','ours-chocolat',15),
  ('bot_pixie','Fond des bois','foret','canard-rose',14),
  ('bot_rafale','Dune dorée','desert','singe-banane',13),
  ('bot_minouche','Oasis du Mochy','desert','renard-braise',12),
  ('bot_gloub','Jardin de sakura','sakura','souris-nuit',11),
  ('bot_nebula','Fête des pétales','sakura','ours-caramel',11),
  ('bot_kiwano','Volcan en éruption','volcan','fantome',10),
  ('bot_pomeline','Base spatiale','volcan','tigre-sable',9),
  ('bot_sirocco','Studio de musique','prairie','cochon-truffe',9),
  ('bot_tutti','Concert galactique','nuit','hibou-lunaire',8),
  ('bot_pastel','Lac zen','prairie','hibou-noisette',8),
  ('bot_oxygne','Jardin japonais','sakura','ours-polaire',7),
  ('bot_pastque','Pôle Nord','neige','ours-chocolat',7),
  ('bot_quartz','Île au trésor','plage','canard-rose',6),
  ('bot_roudoudou','Forêt lumineuse','foret','singe-banane',6),
  ('bot_sleepy','Portail magique','nuit','renard-braise',5),
  ('bot_twinkle','Fête du village','prairie','souris-nuit',5),
  ('bot_vanille','Anniversaire surprise','prairie','ours-caramel',4),
  ('bot_wombat','Cratère de lave','volcan','fantome',4),
  ('bot_xnon','Unicorn land','sakura','tigre-sable',3),
  ('bot_yuzu','Station lunaire','volcan','cochon-truffe',3),
  ('bot_zphyr','Prairie musicale','prairie','hibou-lunaire',2)
)
insert into public.community_scenes
  (user_id, title, data, plush, votes_total, published, published_at, created_at, updated_at)
select
  i.uid,
  i.title,
  jsonb_build_object('theme', i.theme, 'objects', obj.objs,
    'plushY', round((random()*1.6)::numeric, 2),
    'plushScale', round((0.85 + random()*0.5)::numeric, 2)),
  jsonb_build_object('species_id', s.id, 'mutation', null, 'preset',
    jsonb_build_object('id', s.pid, 'name', s.pname, 'root', s.root,
      'tip', s.tip, 'body', s.body, 'glow', s.glow)),
  i.votes, true, pool.ts, pool.ts, pool.ts
from inp i
join sp s on s.id = i.spid
cross join lateral (
  select
    case i.theme when 'prairie' then array['sapin','arbre_rond','buisson','fleur','champignon','rocher','souche','banc','barriere','note','etoile','piano','radio'] when 'nuit' then array['etoile','lanterne','cristal','nuage','portail','hp','note','micro','chapeau','ovni','vinyle'] when 'neige' then array['bonhomme_neige','sapin','rocher','etoile','cristal','nuage','cadeau','cloche'] when 'plage' then array['palmier','parasol','rocher','etang','ballon','banc','coeur'] when 'foret' then array['sapin','arbre_rond','buisson','champignon','souche','rocher','fleur','pont','cristal'] when 'desert' then array['rocher','palmier','parasol','statue','chapeau','souche'] when 'sakura' then array['fleur','arbre_rond','banc','note','etoile','cadeau','coeur','pont','nuage'] when 'volcan' then array['rocher','fusee','cristal','ovni','statue','chapeau','lanterne'] end arr,
    now() - ((0.2 + random()*4.0)::text || ' days')::interval ts,
    7 + floor(random()*8)::int nobj
) pool
cross join lateral (
  select coalesce(jsonb_agg(o), '[]'::jsonb) objs from (
    select jsonb_build_object(
      'id', 'o' || g,
      'type', tt.typ,
      'x', round((rr.r * cos(rr.a))::numeric, 2),
      'z', round((rr.r * sin(rr.a))::numeric, 2),
      'rotY', round((random()*6.28)::numeric, 2),
      'scale', round((0.7 + random()*0.65)::numeric, 2),
      'color', floor(random() * coalesce(cc.n, 3))::int
    ) o
    from generate_series(0, pool.nobj) g
    cross join lateral (
      select pool.arr[1 + floor(random()*array_length(pool.arr, 1))::int] typ
    ) tt
    cross join lateral (
      select random()*6.28318 + g*0 a, 1.7 + random()*4.9 + g*0 r
    ) rr
    cross join lateral (
      select case tt.typ when 'sapin' then 4 when 'arbre_rond' then 3 when 'buisson' then 3 when 'fleur' then 4 when 'champignon' then 3 when 'rocher' then 3 when 'souche' then 2 when 'palmier' then 4 when 'etang' then 3 when 'barriere' then 3 when 'banc' then 3 when 'pont' then 3 when 'parasol' then 4 when 'statue' then 3 when 'note' then 5 when 'hp' then 3 when 'micro' then 3 when 'piano' then 3 when 'radio' then 3 when 'guitare' then 4 when 'cloche' then 3 when 'vinyle' then 4 when 'etoile' then 3 when 'cristal' then 4 when 'nuage' then 3 when 'lanterne' then 3 when 'portail' then 4 when 'chapeau' then 3 when 'fusee' then 3 when 'ovni' then 3 when 'ballon' then 4 when 'coeur' then 3 when 'cadeau' then 3 when 'bonhomme_neige' then 3 end n
    ) cc
  ) o
) obj
on conflict (user_id) do nothing;

-- 3) Votes : bots aléatoires (≠ auteur), cohérents avec votes_total --------
insert into public.community_scene_votes (scene_id, user_id)
select s.id, p.user_id
from public.community_scenes s
cross join lateral (
  select user_id from public.profiles
  where left(user_id, 4) = 'bot_' and user_id <> s.user_id
  order by md5(user_id || s.id::text)
  limit s.votes_total
) p
where left(s.user_id, 4) = 'bot_'
on conflict (scene_id, user_id) do nothing;

-- 4) Recomptage exact ------------------------------------------------------
update public.community_scenes s
set votes_total = (
  select count(*) from public.community_scene_votes v where v.scene_id = s.id
)
where left(s.user_id, 4) = 'bot_';

-- 5) Commentaires sur les 14 scènes les plus votées ------------------------
with top as (
  select s.id, s.user_id,
         row_number() over (order by s.votes_total desc, s.published_at) rn
  from public.community_scenes s
  where left(s.user_id, 4) = 'bot_'
),
gen as (
  select t.id as sid, t.user_id as author, n.n as k
  from top t
  cross join lateral generate_series(1, 2 + floor(random()*2)::int) as n(n)
  where t.rn <= 14
    and not exists (
      select 1 from public.community_scene_comments c where c.scene_id = t.id
    )
)
insert into public.community_scene_comments (id, scene_id, user_id, content, created_at)
select gen_random_uuid(), g.sid,
  (select p.user_id from public.profiles p
   where left(p.user_id, 4) = 'bot_' and p.user_id <> g.author
   order by md5(p.user_id || g.sid::text || g.k::text) limit 1),
  (array['Trop belle scène, j''adore !', 'Waouh, l''ambiance est parfaite', 'Le Mochy au centre, c''est tout mignon', 'Ça mérite la première place', 'J''adore ce thème, bien joué', 'Trop stylé, je vote pour toi', 'Les décorations sont super bien placées', 'Bravo, c''est magnifique', 'La neige fait tout le charme', 'On dirait un vrai petit monde', 'J''adore les couleurs !', 'Voté, bonne chance pour le top 3', 'Superbe scène, continue comme ça', 'Trop mignon tout ça', 'Le petit pont est parfait ici', 'Meilleure scène de la semaine', 'Ça donne envie de jouer', 'Jolie composition, bravo'])[1 + floor(random()*18)::int],
  now() - ((random()*4)::text || ' days')::interval
from gen g
on conflict (id) do nothing;

-- 6) Vérification ----------------------------------------------------------
select
  (select count(*) from public.community_scenes where published)  as scenes_publiees,
  (select count(*) from public.community_scene_votes)             as votes,
  (select count(*) from public.community_scene_comments)          as commentaires,
  (select max(votes_total) from public.community_scenes)          as record_votes,
  (select count(distinct votes_total) from public.community_scenes
    where left(user_id, 4) = 'bot_')                              as votes_distincts;
