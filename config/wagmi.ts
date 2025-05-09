import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "viem/chains";
import { cookieStorage, createStorage, http } from "wagmi";

export const wagmiConfig = getDefaultConfig({
  appName: "StreamFund",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [base],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [base.id]: http(),
  },
});
