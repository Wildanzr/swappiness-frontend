import { base } from "viem/chains";

import { Token } from "@uniswap/sdk-core";
import { zeroAddress } from "viem";

interface AvailableToken {
  token: Token;
  image: string;
}

const ETH = new Token(base.id, zeroAddress, 18, "ETH", "Ether");
const WETH = new Token(
  base.id,
  "0x4200000000000000000000000000000000000006",
  18,
  "WETH",
  "Wrapped Ether"
);

const USDC = new Token(
  base.id,
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  6,
  "USDC",
  "USD Coin"
);
const USDT = new Token(
  base.id,
  "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  6,
  "USDT",
  "Tether USD"
);
const DAI = new Token(
  base.id,
  "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
  18,
  "DAI",
  "Dai Stablecoin"
);
const IDRX = new Token(
  base.id,
  "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22",
  2,
  "IDRX",
  "IDRX"
);
const EURC = new Token(
  base.id,
  "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
  18,
  "EURC",
  "Euro Coin"
);

export const AVAILABLE_TOKENS_IN: AvailableToken[] = [
  { token: ETH, image: "/assets/ethereum.png" },
  { token: USDC, image: "/assets/usdc.png" },
  { token: USDT, image: "/assets/tether.png" },
  { token: DAI, image: "/assets/dai.png" },
];

export const AVAILABLE_TOKENS_OUT: AvailableToken[] = [
  { token: USDC, image: "/assets/usdc.png" },
  { token: USDT, image: "/assets/tether.png" },
  { token: DAI, image: "/assets/dai.png" },
  { token: IDRX, image: "/assets/idrx.png" },
  { token: EURC, image: "/assets/eurc.png" },
  { token: WETH, image: "/assets/weth.png" },
];
