import { Address } from 'viem';
import {
  getPlayersTaikoonBalances,
  getTaikoBlock,
  getTaikoTopPlayers,
} from './actions/taiko-api';
import { Suspense } from 'react';

type ScoreRecord = {
  rank: number;
  address: string;
  score: number;
  multiplier: number;
  totalScore: number;
};

export default async function Home() {
  return (
    <main className='flex flex-col items-center justify-center h-full'>
      <label>Taiko indexer</label>
      <Suspense>
        <LatestBlock />
      </Suspense>
      <Suspense>
        <TaikoTopPlayersList />
      </Suspense>
    </main>
  );
}

async function LatestBlock() {
  const { number } = await getTaikoBlock();

  return <label>Number: {number.toString()}</label>;
}

async function TaikoTopPlayersList() {
  const taikoTopPlayers = (await getTaikoTopPlayers()) as Array<ScoreRecord>;
  const playerAddresses = taikoTopPlayers.map(
    (player) => player.address as Address,
  );
  const taikoonBalances = await getPlayersTaikoonBalances(playerAddresses);

  // Create a Map to store taikoon balances with address as key
  const taikoonBalanceMap = new Map(
    taikoTopPlayers.map((player, index) => [
      player.address,
      taikoonBalances[index],
    ]),
  );

  let balanceHolderCount = 0;
  let nonHolderCount = 0;

  const playerElements = taikoTopPlayers.map((player: ScoreRecord) => {
    const tokenBalance =
      taikoonBalanceMap.get(player.address)?.toString() || '0';
    const hasBalance = BigInt(tokenBalance) > BigInt(0);

    if (hasBalance) {
      balanceHolderCount++;
    } else {
      nonHolderCount++;
    }

    return (
      <div key={player.rank}>
        <label className={hasBalance ? 'text-green-400' : 'text-red-400'}>
          rank: {player.rank} - {player.address}: {tokenBalance}
        </label>
      </div>
    );
  });

  return (
    <div>
      <div className='mb-4'>
        <p>Total Balance Holders (Green): {balanceHolderCount}</p>
        <p>Total Non-Holders (Red): {nonHolderCount}</p>
      </div>
      {playerElements}
    </div>
  );
}
