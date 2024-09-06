import { Metadata } from 'next';
import UserSection from './components/UserSection';
import { Suspense } from 'react';
import { getTaikoTopPlayers } from '@/app/actions/taiko-api';
import { ScoreRecord } from '../page';

type Props = {
  params: { address: string };
};

export async function generateMetadata({
  params: { address }
}: Props): Promise<Metadata> {
  return {
    title: address
  };
}

export async function generateStaticParams() {
  const taikoTopPlayers = (await getTaikoTopPlayers()) as ScoreRecord[];

  return taikoTopPlayers.map((player) => ({
    address: player.address
  }));
}

export default function UserPage({ params: { address } }: Props) {
  return (
    <main>
      {/* <Suspense> */}
      <UserSection address={address} />
      {/* </Suspense> */}
    </main>
  );
}
