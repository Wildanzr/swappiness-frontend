"use server";

import { getServerActionSession } from "@/config/iron";

export const submitCookieToStorageServerAction = async (cookie: string) => {
  const session = await getServerActionSession();
  session.nonce = cookie;
  await session.save();
};

export const readCookieFromStorageServerAction = async (): Promise<
  string | null
> => {
  const session = await getServerActionSession();
  return session.nonce || null;
};
