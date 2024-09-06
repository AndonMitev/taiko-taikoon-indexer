import { Address } from 'viem';
import {
  getPlayersTaikoonBalances,
  getTaikoBlock,
  getTaikoTopPlayers
} from '../actions/taiko-api';
import { Suspense } from 'react';
import Link from 'next/link';

export type ScoreRecord = {
  rank: number;
  address: string;
  score: number;
  multiplier: number;
  totalScore: number;
};

type TaikoonBalances = {
  balanceHolders: number;
  nonHolders: number;
};

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center h-full'>
      <h1>Taiko indexer</h1>
      <Suspense fallback={<div>Loading latest block...</div>}>
        <LatestBlock />
      </Suspense>
      <Suspense fallback={<div>Loading top players...</div>}>
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
  const taikoTopPlayers = (await getTaikoTopPlayers()) as ScoreRecord[];
  const playerAddresses = taikoTopPlayers.map(
    (player) => player.address as Address
  );
  const taikoonBalances = await getPlayersTaikoonBalances(playerAddresses);

  const balancesInfo = taikoonBalances.reduce<TaikoonBalances>(
    (acc, balance) => {
      BigInt(balance) > BigInt(0) ? acc.balanceHolders++ : acc.nonHolders++;
      return acc;
    },
    { balanceHolders: 0, nonHolders: 0 }
  ) as { balanceHolders: number; nonHolders: number };

  return (
    <div>
      <PlayerStats
        balanceHolders={balancesInfo.balanceHolders}
        nonHolders={balancesInfo.nonHolders}
      />
      <PlayerList players={taikoTopPlayers} balances={taikoonBalances} />
    </div>
  );
}

type PlayerStatsProps = {
  balanceHolders: number;
  nonHolders: number;
};

function PlayerStats({ balanceHolders, nonHolders }: PlayerStatsProps) {
  return (
    <div className='mb-4'>
      <p>Total Balance Holders (Green): {balanceHolders}</p>
      <p>Total Non-Holders (Red): {nonHolders}</p>
    </div>
  );
}

type PlayerListProps = {
  players: ScoreRecord[];
  balances: bigint[];
};

function PlayerList({ players, balances }: PlayerListProps) {
  return (
    <div>
      {players.map((player, index) => (
        <PlayerListItem
          key={player.rank}
          player={player}
          balance={balances[index]}
        />
      ))}
    </div>
  );
}

type PlayerListItemProps = {
  player: ScoreRecord;
  balance: bigint;
};

function PlayerListItem({ player, balance }: PlayerListItemProps) {
  const hasBalance = BigInt(balance) > BigInt(0);
  return (
    <Link href={`/ranking/${player.address}`}>
      <div className={hasBalance ? 'text-green-400' : 'text-red-400'}>
        rank: {player.rank} - {player.address}: {balance.toString()}
      </div>
    </Link>
  );
}
