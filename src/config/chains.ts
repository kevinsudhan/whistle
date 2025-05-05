import { sepolia, polygonMumbai, polygon, type Chain } from "viem/chains";

// Define SEI Atlantic-2 testnet
export const seiAtlantic2: Chain = {
  id: 1328,
  name: 'SEI Atlantic-2 Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SEI',
    symbol: 'SEI',
  },
  rpcUrls: {
    default: {
      http: ['https://evm-rpc-testnet.sei-apis.com'],
    },
    public: {
      http: ['https://evm-rpc-testnet.sei-apis.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'SEI Explorer',
      url: 'https://atlantic-2.explorer.sei-apis.com',
    },
  },
  testnet: true,
};

// Re-export the chains
export { sepolia, polygonMumbai, polygon };

// Define the chains we want to support
export const supportedChains = [
  seiAtlantic2, // SEI Atlantic-2 testnet
  sepolia,      // Ethereum testnet
  polygonMumbai, // Polygon testnet
  polygon       // Polygon mainnet
] as const satisfies readonly [Chain, ...Chain[]];

// Default chain for development
export const defaultChain = seiAtlantic2;
