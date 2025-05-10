/**
 * @file Global.d.ts
 * @description This file contains the TypeScript type definitions for the global types
 */

import { Token } from "@uniswap/sdk-core";

export {};

declare global {
  interface AvailableToken {
    token: Token;
    image: string;
  }

  interface AvailableRoute {
    tokenA: Token;
    tokenB: Token;
    fee: number;
  }

  interface Route {
    path: Token[];
    fees: number[];
  }
}
