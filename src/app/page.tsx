import { redirect } from 'next/navigation';
import PlushWorld from '@/components/plush/PlushWorld';
import { getSession } from '@/lib/auth/session';

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect('/login?redirect=%2F');
  }

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-[#070609]">
      <PlushWorld />
    </main>
  );
}
