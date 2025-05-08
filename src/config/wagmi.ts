import { createConfig, http } from "wagmi";
import { supportedChains } from "./chains";
import { injected, metaMask, coinbaseWallet, walletConnect } from "wagmi/connectors";

// Create wagmi config
export const config = createConfig({
  chains: supportedChains,
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({
      appName: "Whistle Finance",
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID", // Replace with your WalletConnect Project ID
    }),
  ],
  transports: {
    420420421: http(),    // Westend Asset Hub
    11155111: http(), // Sepolia
    80001: http(),    // Polygon Mumbai
    137: http(),      // Polygon Mainnet
  },
});
