import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { localhost, base } from "viem/chains";
import { cookieStorage, createStorage, http } from "wagmi";

const MODE = process.env.NEXT_PUBLIC_WEB3_MODE as "testnet" | "mainnet";

export const wagmiConfig = getDefaultConfig({
  appName: "Swappiness",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: MODE === "mainnet" ? [base] : [localhost],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports:
    MODE === "mainnet"
      ? {
          [base.id]: http(),
        }
      : {
          [localhost.id]: http(),
        },
});
