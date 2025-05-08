import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { signIn, signOut } from "next-auth/react";
import { createSiweMessage } from "viem/siwe";

export const siweAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    const verifyResult = await fetch("/api/nonce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!verifyResult.ok) {
      throw new Error("Failed to get nonce");
    }

    const data = await verifyResult.json();
    return data.nonce;
  },

  createMessage: ({ nonce, address, chainId }) => {
    return createSiweMessage({
      domain: window.location.hostname,
      address,
      statement: `You are signing in to StreamFund on ${new Date().toLocaleString()}`,
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
      expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });
  },

  verify: async ({ message, signature }) => {
    const loginData = { message, signature };
    const verifyResult = await signIn("credentials", {
      redirect: false,
      ...loginData,
    });

    return Boolean(verifyResult?.ok);
  },

  signOut: async () => {
    await signOut();
  },
});
