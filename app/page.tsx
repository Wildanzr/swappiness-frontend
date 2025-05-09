"use client";

import Image from "next/image";
import React from "react";
import SwapForm from "./_components/swap-form";

const TestLogin = () => {
  return (
    <div className="container mx-auto flex flex-col space-y-10 items-center justify-center h-full">
      <div className="w-fit min-w-fit flex flex-row items-center justify-center gap-2 rounded-full bg-white p-2 border-border border-2">
        <Image
          src={"/assets/coinbase.svg"}
          alt="base"
          width={24}
          height={24}
          className=""
        />
        <p className="text-2xl font-medium text-coinbase font-sans whitespace-nowrap">
          Build on Base
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-5">
        <h1 className="font-sans text-6xl font-semibold text-center text-neutral-900">
          Swap Globally,
        </h1>
        <h1 className="font-sans text-6xl font-semibold text-center text-neutral-900">
          Spread Happiness
        </h1>
      </div>

      <SwapForm />
    </div>
  );
};

export default TestLogin;
