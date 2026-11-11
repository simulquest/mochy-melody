'use client';

import { useMemo } from 'react';
import { CalendarDays, MoonStar, Sparkles } from 'lucide-react';
import PlushPreview3D from '@/components/plush/PlushPreview3D';
import { RARITIES } from '@/lib/plush/lootbox';
import {
  featuredSpecial,
  specialCard,
  SPECIAL_CHEST_WEEK_CHANCE,
  SPECIAL_CHEST_MONTH_CHANCE,
} from '@/lib/plush/specials';
import { getSpecies } from '@/lib/plush/species';

/**
 * Vitrine des peluches uniques sur la landing (page de connexion).
 *
 * Affiche l'offre EXACTE en cours — la peluche de la semaine (Commune, Rare
 * ou Épique selon la rotation) et la peluche du mois (toujours Mythique) —
 * calculée côté client avec le même calendrier UTC que le serveur
 * (`featuredSpecial`, voir `src/lib/plush/specials.ts`). Aucun appel API :
 * l'offre est publique et déterministe, et la landing reste consultable
 * sans être connecté.
 *
 * L'obtention ne se fait PAS par un bouton : dans le jeu, un coffre mystère
 * tombe du ciel une fois par jour, avec un pourcentage de chance de
 * contenir ces peluches (sinon une peluche aléatoire de consolation).
 */
export default function SpecialPlushTeasers() {
  const offers = useMemo(
    () => [
      {
        period: 'week' as const,
        icon: CalendarDays,
        label: 'Cette semaine',
        chance: SPECIAL_CHEST_WEEK_CHANCE,
        card: specialCard(featuredSpecial('week')),
      },
      {
        period: 'month' as const,
        icon: MoonStar,
        label: 'Ce mois-ci',
        chance: SPECIAL_CHEST_MONTH_CHANCE,
        card: specialCard(featuredSpecial('month')),
      },
    ],
    [],
  );

  return (
    <section
      aria-label="Peluches uniques de la semaine et du mois"
      className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0 text-amber-300" aria-hidden />
        <h2 className="text-sm font-black tracking-tight text-white">
          Peluches uniques
        </h2>
      </div>

      <p className="mt-1.5 text-[11px] leading-relaxed text-white/50">
        Chaque jour, un coffre mystère tombe du ciel dans le jeu : il peut
        contenir la peluche exclusive de la semaine ({Math.round(SPECIAL_CHEST_WEEK_CHANCE * 100)} % de
        chance, Commune à Épique maximum) ou celle du mois
        ({Math.round(SPECIAL_CHEST_MONTH_CHANCE * 100)} %, Mythique) — sinon, une
        peluche aléatoire en consolation. Des silhouettes inédites, sans
        aucune mutation, introuvables dans les coffres, et impossible à
        réobtenir une fois gagnée.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {offers.map(({ period, icon: Icon, label, chance, card }) => {
          const rarity = RARITIES[card.rarityIdx];
          return (
            <div
              key={period}
              className="rounded-2xl border bg-black/30 p-3"
              style={{
                borderColor: `${rarity.color}33`,
                boxShadow: `0 0 14px ${rarity.color}1a`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.14em] text-white/45">
                  <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden />
                  {label}
                </span>
                <span
                  className="shrink-0 whitespace-nowrap text-[9px] font-black"
                  style={{ color: rarity.color }}
                >
                  {Math.round(chance * 100)} %/j
                </span>
              </div>

              <div className="mt-1 flex justify-center">
                <PlushPreview3D
                  species={getSpecies(card.id)}
                  preset={card.preset}
                  mutation={null}
                  size={84}
                />
              </div>

              <p className="truncate text-center text-[13px] font-bold leading-tight text-white">
                {card.name}
              </p>
              <p className="mt-0.5 text-center text-[9px] font-black uppercase tracking-wide" style={{ color: rarity.color }}>
                {rarity.name}
                <span className="font-semibold normal-case tracking-normal text-white/40">
                  {' '}· sans mutation
                </span>
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[10px] font-medium text-white/35">
        À gagner dans le jeu : touche le coffre mystère quand il tombe du ciel !
      </p>
    </section>
  );
}
