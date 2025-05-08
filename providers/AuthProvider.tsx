"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import RainbowKitProvider from "./RainbowKitProvider";

interface AuthProviderProps {
  children: React.ReactNode;
  session: Session;
  cookie: string;
}

const AuthProvider = ({ children, session, cookie }: AuthProviderProps) => {
  return (
    <SessionProvider baseUrl={process.env.NEXTAUTH_URL} session={session}>
      <RainbowKitProvider cookie={cookie}>{children}</RainbowKitProvider>
    </SessionProvider>
  );
};

export default AuthProvider;
