"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react";
import { Button } from "../ui/button";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

const HeaderLayout = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-row items-center justify-between w-full px-10 bg-white p-5 rounded-full border-2 border-border">
      <Link href="/">
        <h1 className="text-2xl font-sans font-medium text-black">
          Swap<span className="text-main">piness</span>
        </h1>
      </Link>

      <div className="flex flex-row items-center justify-center gap-5">
        <Link href="/about">
          <p className="text-lg font-sans font-medium text-black hover:text-main transition-all duration-300">
            About
          </p>
        </Link>
        <Link href="/builders">
          <p className="text-lg font-sans font-medium text-black hover:text-main transition-all duration-300">
            Builders
          </p>
        </Link>
      </div>

      {isConnected ? (
        <ConnectButton chainStatus={"none"} accountStatus={"avatar"} />
      ) : (
        <Button
          className="rounded-full cursor-pointer"
          onClick={openConnectModal}
          disabled={!openConnectModal}
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default HeaderLayout;
