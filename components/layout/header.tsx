"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react";
import { Button } from "../ui/button";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import MobileHeaderLayout from "./mobile-header";

const HeaderLayout = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center w-full h-fit">
      <div className="flex flex-row items-center justify-between w-full min-w-sm bg-white px-5 py-2 border-2 border-border rounded-full">
        <MobileHeaderLayout />

        <Link href="/" className="hidden lg:block">
          <h1 className="text-2xl font-sans font-medium text-black">
            Swap<span className="text-coinbase">piness</span>
          </h1>
        </Link>

        <div className="hidden lg:flex flex-row items-center justify-center gap-5">
          <Link href="/about">
            <p className="text-lg font-sans font-medium text-black hover:text-coinbase transition-all duration-300">
              About
            </p>
          </Link>
          <Link href="/builders">
            <p className="text-lg font-sans font-medium text-black hover:text-coinbase transition-all duration-300">
              Builders
            </p>
          </Link>
        </div>

        {isConnected ? (
          <ConnectButton chainStatus={"none"} accountStatus={"avatar"} />
        ) : (
          <Button
            className="cursor-pointer rounded-full"
            onClick={openConnectModal}
            disabled={!openConnectModal}
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeaderLayout;
