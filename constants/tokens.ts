import { base, hardhat } from "viem/chains";

import { Token } from "@uniswap/sdk-core";
import { zeroAddress } from "viem";
import { FeeAmount } from "@uniswap/v3-sdk";

const MODE = process.env.NEXT_PUBLIC_WEB3_MODE as "testnet" | "mainnet";

const ETH = new Token(
  MODE === "testnet" ? hardhat.id : base.id,
  zeroAddress,
  18,
  "ETH",
  "Ether"
);
export const WETH = new Token(
  MODE === "testnet" ? hardhat.id : base.id,
  "0x4200000000000000000000000000000000000006",
  18,
  "WETH",
  "Wrapped Ether"
);

const USDC = new Token(
  MODE === "testnet" ? hardhat.id : base.id,
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  6,
  "USDC",
  "USD Coin"
);
const USDT = new Token(
  MODE === "testnet" ? hardhat.id : base.id,
  "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  6,
  "USDT",
  "Tether USD"
);
const DAI = new Token(
  MODE === "testnet" ? hardhat.id : base.id,
  "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
  18,
  "DAI",
  "Dai Stablecoin"
);
const IDRX = new Token(
  MODE === "testnet" ? hardhat.id : base.id,
  "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22",
  2,
  "IDRX",
  "IDRX"
);
const EURC = new Token(
  MODE === "testnet" ? hardhat.id : base.id,
  "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
  6,
  "EURC",
  "Euro Coin"
);

export const AVAILABLE_TOKENS_IN: AvailableToken[] = [
  { token: ETH, image: "/assets/ethereum.png" },
  { token: WETH, image: "/assets/weth.png" },
  { token: USDC, image: "/assets/usdc.png" },
  { token: USDT, image: "/assets/tether.png" },
  { token: DAI, image: "/assets/dai.png" },
  { token: IDRX, image: "/assets/idrx.png" },
];

export const AVAILABLE_TOKENS_OUT: AvailableToken[] = [
  { token: USDC, image: "/assets/usdc.png" },
  { token: USDT, image: "/assets/tether.png" },
  { token: DAI, image: "/assets/dai.png" },
  { token: IDRX, image: "/assets/idrx.png" },
  { token: EURC, image: "/assets/eurc.png" },
  // { token: WETH, image: "/assets/weth.png" },
];

// V3
// IDRX/USDC		0.01%
// USDC/USDT		0.01%
// WETH/USDT		0.05%
// EURC/USDC		0.30%
//// WETH/EURC	  0.30%
// DAI/USDC		  0.01%
//// WETH/DAI			0.05%
// WETH/USDC	  0.05%

export const AVAILABLE_ROUTES: AvailableRoute[] = [
  { tokenA: IDRX, tokenB: USDC, fee: FeeAmount.LOWEST }, // 0.01%
  { tokenA: USDC, tokenB: USDT, fee: FeeAmount.LOWEST }, // 0.01%
  { tokenA: WETH, tokenB: USDT, fee: FeeAmount.LOW }, // 0.05%
  { tokenA: EURC, tokenB: USDC, fee: FeeAmount.MEDIUM }, // 0.30%
  // { tokenA: WETH, tokenB: EURC, fee: FeeAmount.MEDIUM }, // 0.30%
  { tokenA: DAI, tokenB: USDC, fee: FeeAmount.LOWEST }, // 0.01%
  // { tokenA: WETH, tokenB: DAI, fee: FeeAmount.LOW }, // 0.05%
  { tokenA: WETH, tokenB: USDC, fee: FeeAmount.LOW }, // 0.05%
];
