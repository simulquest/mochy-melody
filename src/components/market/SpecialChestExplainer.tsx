import {
  CalendarDays,
  CloudRain,
  Gift,
  MoonStar,
  MousePointerClick,
  PartyPopper,
} from 'lucide-react';
import { RARITIES } from '@/lib/plush/lootbox';
import {
  featuredSpecial,
  specialCard,
  SPECIAL_CHEST_WEEK_CHANCE,
  SPECIAL_CHEST_MONTH_CHANCE,
} from '@/lib/plush/specials';

/**
 * Section explicative de la landing : le système des peluches uniques.
 *
 * Complète la vitrine `SpecialPlushTeasers` (les exclusives du moment, en 3D)
 * en expliquant le principe : UNE peluche exclusive par semaine (Commune à
 * Épique maximum, design renouvelé chaque lundi) et UNE par mois (Mythique),
 * à gagner via le coffre mystère qui tombe du ciel — une tentative par jour,
 * chances affichées, peluche de consolation sinon, jamais réobtensible une
 * fois la période gagnée.
 *
 * Composant serveur : aucune donnée privée ici, tout est calculé avec le
 * même calendrier UTC public que le jeu (`featuredSpecial`, voir
 * `src/lib/plush/specials.ts`).
 */
export default function SpecialChestExplainer() {
  const weekCard = specialCard(featuredSpecial('week'));
  const monthCard = specialCard(featuredSpecial('month'));
  const weekRarity = RARITIES[weekCard.rarityIdx];
  const monthRarity = RARITIES[monthCard.rarityIdx];

  return (
    <section
      aria-label="Une peluche unique chaque semaine et chaque mois"
      className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-2">
        <Gift className="h-4 w-4 shrink-0 text-amber-300" aria-hidden />
        <h2 className="text-sm font-black tracking-tight text-white">
          Une peluche unique chaque semaine et chaque mois
        </h2>
      </div>

      {/* ----- Les deux cadences : semaine / mois ----- */}
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div
          className="rounded-2xl border bg-black/30 p-3"
          style={{
            borderColor: `${weekRarity?.color ?? '#ffffff'}33`,
            boxShadow: `0 0 14px ${weekRarity?.color ?? '#ffffff'}1a`,
          }}
        >
          <span className="flex items-center gap-1 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.14em] text-white/55">
            <CalendarDays className="h-3 w-3 shrink-0" aria-hidden />
            Chaque semaine
          </span>
          <p className="mt-1.5 text-[10px] leading-relaxed text-white/55">
            Une exclusive inédite renouvelée chaque lundi — Commune, Rare ou
            Épique, jamais plus haut.
          </p>
          <p
            className="mt-1.5 truncate text-[10px] font-bold leading-tight"
            style={{ color: weekRarity?.color ?? '#ffffff' }}
          >
            {weekCard.name}
          </p>
          <p className="text-[9px] font-semibold text-white/40">
            cette semaine · {weekRarity?.name ?? 'exclusive'}
          </p>
        </div>

        <div
          className="rounded-2xl border bg-black/30 p-3"
          style={{
            borderColor: `${monthRarity?.color ?? '#ffffff'}33`,
            boxShadow: `0 0 14px ${monthRarity?.color ?? '#ffffff'}1a`,
          }}
        >
          <span className="flex items-center gap-1 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.14em] text-white/55">
            <MoonStar className="h-3 w-3 shrink-0" aria-hidden />
            Chaque mois
          </span>
          <p className="mt-1.5 text-[10px] leading-relaxed text-white/55">
            La plus rare de toutes : une Mythique exclusive à décrocher ce
            mois-ci.
          </p>
          <p
            className="mt-1.5 truncate text-[10px] font-bold leading-tight"
            style={{ color: monthRarity?.color ?? '#ffffff' }}
          >
            {monthCard.name}
          </p>
          <p className="text-[9px] font-semibold text-white/40">
            ce mois-ci · Mythique
          </p>
        </div>
      </div>

      {/* ----- Comment l'obtenir ----- */}
      <h3 className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
        Comment l&apos;obtenir ?
      </h3>
      <ol className="mt-2 flex flex-col gap-2.5">
        <li className="flex gap-2.5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/10 text-amber-200">
            <CloudRain className="h-3 w-3" aria-hidden />
          </span>
          <div>
            <p className="text-[11px] font-bold text-white">Guette le ciel</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">
              De temps en temps, un coffre mystère tombe du ciel — où que tu
              sois sur le site.
            </p>
          </div>
        </li>
        <li className="flex gap-2.5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/10 text-amber-200">
            <MousePointerClick className="h-3 w-3" aria-hidden />
          </span>
          <div>
            <p className="text-[11px] font-bold text-white">Touche-le vite</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">
              Il ne reste au sol que quelques secondes. Touché, il
              s&apos;ouvre : une seule tentative par jour !
            </p>
          </div>
        </li>
        <li className="flex gap-2.5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/10 text-amber-200">
            <PartyPopper className="h-3 w-3" aria-hidden />
          </span>
          <div>
            <p className="text-[11px] font-bold text-white">
              Découvre ta récompense
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">
              {Math.round(SPECIAL_CHEST_WEEK_CHANCE * 100)}&nbsp;% de chance
              d&apos;y trouver la peluche de la semaine,{' '}
              {Math.round(SPECIAL_CHEST_MONTH_CHANCE * 100)}&nbsp;% celle du
              mois — sinon une peluche de consolation. Raté&nbsp;? Un autre
              coffre retombera, et demain tu retentes ta chance&nbsp;!
            </p>
          </div>
        </li>
      </ol>

      {/* ----- Points clés ----- */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {[
          'Silhouettes inédites',
          'Sans mutation',
          'Introuvables dans les coffres',
          'Une seule fois par période',
        ].map((label) => (
          <span
            key={label}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold text-white/55"
          >
            {label}
          </span>
        ))}
      </div>

      <p className="mt-3 text-center text-[10px] font-medium text-white/35">
        Connecte-toi et guette le ciel : le prochain coffre n&apos;attend que
        toi&nbsp;!
      </p>
    </section>
  );
}
