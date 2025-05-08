"use client";

import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";
import React from "react";

const TestLogin = () => {
  const session = useSession();

  return (
    <>
      <ConnectButton />

      <Button>Hit Me Up!</Button>
      <div className="flex">
        <p className="text-2xl">
          {session.status === "authenticated"
            ? `Logged in as ${session.data?.user?.address}`
            : "Not logged in"}
        </p>
        <p className="text-2xl">{session.data?.accessToken}</p>
      </div>
    </>
  );
};

export default TestLogin;
