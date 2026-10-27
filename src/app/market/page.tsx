import Marketplace from '@/components/market/Marketplace';
import LoginWithSimulquest from '@/components/market/LoginWithSimulquest';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';

export const metadata = {
  title: 'Marché — Mochy Melody',
  description: 'Enchérissez, vendez vos peluches et suivez le cours des cartes.',
};

export default async function MarketPage({
  searchParams,
}: {
  searchParams: Promise<{ sell?: string; tutorial?: string }>;
}) {
  const session = await getSession();
  const { sell, tutorial } = await searchParams;

  if (!session) {
    return (
      <main className="flex min-h-[100dvh] w-full items-center justify-center bg-[#070609] px-5">
        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/30 to-pink-500/20 text-4xl">
            🏪
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Marché PlushVerse
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Connectez-vous pour vendre vos cartes, enchérir et suivre le cours
            des peluches.
          </p>
          <div className="mt-7">
            <LoginWithSimulquest redirect="/" />
          </div>
          <div className="mt-6">
            <Link
              href="/login?redirect=%2F"
              className="text-xs text-white/40 transition-colors hover:text-white/70"
            >
              Plus d&apos;options de connexion
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const tutorialStep = tutorial === 'market' ? 6 : undefined;
  return <Marketplace initialSellId={sell ?? null} tutorialStep={tutorialStep} />;
}
