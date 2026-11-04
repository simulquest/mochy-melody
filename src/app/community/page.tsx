import CommunityGallery from '@/components/community/CommunityGallery';
import LoginWithSimulquest from '@/components/market/LoginWithSimulquest';
import BottomNav from '@/components/plush/BottomNav';
import { getSession } from '@/lib/auth/session';
import Link from 'next/link';

export const metadata = {
  title: 'Communauté — Mochy Melody',
  description:
    'Découvre les mondes créés par les joueurs, vote pour tes scènes préférées et gagne des MochyCoins chaque semaine.',
};

export default async function CommunityPage() {
  const session = await getSession();

  if (!session) {
    return (
      <main className="flex min-h-[100dvh] w-full items-center justify-center bg-theme-bg px-5 pb-24">
        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="text-4xl" aria-hidden>🌍</div>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-white">
            Communauté
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Connecte-toi pour créer ton monde, voter pour les scènes des
            joueurs et remporter les MochyCoins hebdomadaires.
          </p>
          <div className="mt-7">
            <LoginWithSimulquest redirect="/community" />
          </div>
          <div className="mt-6">
            <Link
              href="/login?redirect=%2Fcommunity"
              className="text-xs text-white/40 transition-colors hover:text-white/70"
            >
              Plus d&apos;options de connexion
            </Link>
          </div>
        </div>
        <BottomNav active="community" />
      </main>
    );
  }

  return <CommunityGallery />;
}
