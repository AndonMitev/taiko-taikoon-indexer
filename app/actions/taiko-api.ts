import { Address, createPublicClient, http, Abi } from 'viem';
import { multicall } from 'viem/actions';
import { taiko } from 'viem/chains';
import TaikoonContractABI from '../abis/TaikoonContractABI';

const client = createPublicClient({
  chain: taiko,
  transport: http(),
});

const taikoonContract = {
  address: '0x4a045c5016b200f7e08a4cabb2cda6e85bf53295',
  abi: TaikoonContractABI as Abi,
} as const;

export async function getTaikoTopPlayers() {
  const response = await fetch(
    'https://trailblazer.mainnet.taiko.xyz/v2/leaderboard/user?page=0&size=500&first=0&last=1',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Referer: 'https://trailblazer.mainnet.taiko.xyz/',
        Origin: 'https://trailblazer.mainnet.taiko.xyz',
      },
      next: {
        revalidate: 60,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch top players: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as any;

  return data.data.items;
}

export async function getTaikoBlock() {
  const latestBlock = await client.getBlock();
  return latestBlock;
}

export async function getPlayersTaikoonBalances(addresses: Address[]) {
  const contracts = addresses.map((address) => ({
    ...taikoonContract,
    functionName: 'balanceOf',
    args: [address],
  }));

  const results = await multicall(client, {
    contracts: contracts,
  });

  return results.map((result) =>
    result.status === 'success' ? result.result : BigInt(0),
  );
}
