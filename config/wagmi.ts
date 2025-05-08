import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrumSepolia, baseSepolia } from "viem/chains";
import { cookieStorage, createStorage, http } from "wagmi";

export const wagmiConfig = getDefaultConfig({
  appName: "StreamFund",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [baseSepolia, arbitrumSepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [baseSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});
