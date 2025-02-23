import { Network, Alchemy } from 'alchemy-sdk';

if (!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_ALCHEMY_API_KEY environment variable');
}

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.BASE_MAINNET,
};

export const alchemyMainnet = new Alchemy(settings);

const sepoliaSettings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.BASE_SEPOLIA,
};

export const alchemySepolia = new Alchemy(sepoliaSettings);

export const getBlockByNumber = async (blockNumber: number, network: 'mainnet' | 'sepolia' = 'mainnet') => {
  const alchemy = network === 'mainnet' ? alchemyMainnet : alchemySepolia;
  return await alchemy.core.getBlock(blockNumber);
};

export const getTransactionsByAddress = async (address: string, network: 'mainnet' | 'sepolia' = 'mainnet') => {
  const alchemy = network === 'mainnet' ? alchemyMainnet : alchemySepolia;
  return await alchemy.core.getAssetTransfers({
    fromBlock: '0x0',
    fromAddress: address,
    category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
  });
};

export const getTokenBalances = async (address: string, network: 'mainnet' | 'sepolia' = 'mainnet') => {
  const alchemy = network === 'mainnet' ? alchemyMainnet : alchemySepolia;
  return await alchemy.core.getTokenBalances(address);
};

export const getNFTs = async (address: string, network: 'mainnet' | 'sepolia' = 'mainnet') => {
  const alchemy = network === 'mainnet' ? alchemyMainnet : alchemySepolia;
  return await alchemy.nft.getNftsForOwner(address);
};
