import { submitCookieToStorageServerAction } from "@/utils/actions/cookie";
import { NextResponse } from "next/server";
import { generateSiweNonce } from "viem/siwe";

export async function POST() {
  try {
    const nonce = generateSiweNonce();
    await submitCookieToStorageServerAction(nonce);
    return NextResponse.json(
      {
        nonce,
      },
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
