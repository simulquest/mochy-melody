'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type BottomNavSection = 'lootbox' | 'collection' | 'market' | 'shop';

const ITEMS: {
  id: BottomNavSection;
  href: string;
  icon: string;
  label: string;
}[] = [
  { id: 'lootbox', href: '/play?view=lootbox', icon: 'fa-solid fa-gift', label: 'Lootbox' },
  { id: 'collection', href: '/play?view=collection', icon: 'fa-solid fa-paw', label: 'Ma collection' },
  { id: 'market', href: '/market', icon: 'fa-solid fa-store', label: 'Marché' },
  { id: 'shop', href: '/shop', icon: 'fa-solid fa-cart-shopping', label: 'Boutique' },
];

/**
 * Barre de navigation fixe en bas de l'écran — icônes Font Awesome sans texte,
 * commune à toutes les sections (lootbox, collection, marché, boutique).
 *
 * `active` lève l'ambiguïté sur /play où deux sections partagent la même route ;
 * `tutorialMarket` pose l'ancre data-tutorial du tutoriel sur l'item Marché.
 */
export default function BottomNav({
  active,
  tutorialMarket = false,
}: {
  active?: BottomNavSection;
  tutorialMarket?: boolean;
}) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigation principale"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/65 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl">
        {ITEMS.map((item) => {
          const isActive = active ? item.id === active : pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              data-tutorial={item.id === 'market' && tutorialMarket ? 'market' : undefined}
              className={`flex h-11 w-14 items-center justify-center rounded-full text-[17px] leading-none transition-all active:scale-90 ${
                isActive
                  ? 'bg-gradient-to-br from-fuchsia-500/35 to-pink-500/20 text-fuchsia-100 shadow-[inset_0_0_0_1px_rgba(232,121,249,0.35)]'
                  : 'text-white/45 hover:bg-white/5 hover:text-white/85'
              }`}
            >
              <i className={item.icon} aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
