import { redirect } from 'next/navigation';
import ChestShop from '@/components/plush/ChestShop';
import { getSession } from '@/lib/auth/session';

export const metadata = {
  title: 'Boutique — Mochy Melody',
  description: 'Achetez des coffres et découvrez immédiatement de nouvelles peluches.',
};

export default async function ShopPage() {
  const session = await getSession();
  if (!session) redirect('/login?redirect=%2Fshop');

  return <ChestShop />;
}
