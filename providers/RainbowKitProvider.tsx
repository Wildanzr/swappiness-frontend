"use client";

import { wagmiConfig } from "@/config/wagmi";
import { useSession } from "next-auth/react";
import React from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import QueryProvider from "./QueryProvider";
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider as NextRainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { siweAdapter } from "@/adapters/siwe";
import "@rainbow-me/rainbowkit/styles.css";

interface RainbowKitProviderProps {
  children: React.ReactNode;
  cookie: string;
}

const RainbowKitProvider = ({ children, cookie }: RainbowKitProviderProps) => {
  const { status } = useSession();
  const initialState = cookieToInitialState(wagmiConfig, cookie);
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryProvider>
        <RainbowKitAuthenticationProvider adapter={siweAdapter} status={status}>
          <NextRainbowKitProvider>{children}</NextRainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryProvider>
    </WagmiProvider>
  );
};

export default RainbowKitProvider;
