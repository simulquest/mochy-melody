import SceneStudio from '@/components/community/SceneStudio';
import LoginWithSimulquest from '@/components/market/LoginWithSimulquest';
import BottomNav from '@/components/plush/BottomNav';
import { getSession } from '@/lib/auth/session';
import Link from 'next/link';

export const metadata = {
  title: 'Mon studio — Mochy Melody',
  description: 'Décore ton monde 3D autour de ton Mochy et publie-le à la communauté.',
};

export default async function StudioPage() {
  const session = await getSession();

  if (!session) {
    return (
      <main className="flex min-h-[100dvh] w-full items-center justify-center bg-theme-bg px-5 pb-24">
        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="text-4xl" aria-hidden>✨</div>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-white">
            Mon studio
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Connecte-toi pour décorer ton monde autour de ton Mochy et le
            publier à la communauté.
          </p>
          <div className="mt-7">
            <LoginWithSimulquest redirect="/community/studio" />
          </div>
          <div className="mt-6">
            <Link
              href="/login?redirect=%2Fcommunity%2Fstudio"
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

  return <SceneStudio />;
}
