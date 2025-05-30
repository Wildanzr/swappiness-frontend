/* eslint-disable prefer-const */
import { QUOTER_ADDRESSES, Token } from "@uniswap/sdk-core";
import { base } from "viem/chains";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { ethers, providers } from "ethers";
import { AVAILABLE_ROUTES, WETH } from "@/constants/tokens";
import { formatUnits, zeroAddress } from "viem";

const getProvider = (): providers.Provider => {
  return new ethers.providers.JsonRpcProvider(
    "https://base-mainnet.g.alchemy.com/v2/ZlzkGJhwX4ik8IQeDXVoM5A3YLbVIMpe"
  );
};

export const quoteExactOutput = async (
  tokenIn: Token,
  tokenOut: Token,
  amountOut: string
): Promise<string> => {
  if (tokenIn.address === zeroAddress) {
    tokenIn = WETH;
  }

  if (tokenIn.address === tokenOut.address) {
    return amountOut;
  }

  const qouterAddress = QUOTER_ADDRESSES[base.id];
  const quoterContract = new ethers.Contract(
    qouterAddress,
    Quoter.abi,
    getProvider()
  );

  const bestRoute = getSwapRoutes(tokenIn, tokenOut);
  if (!bestRoute) {
    console.error("No route found");
    return "";
  }

  const addressPath = bestRoute.path.map((token) => token.address).reverse();
  const feePath = bestRoute.fees.reverse();
  const path = encodePath(addressPath, feePath);

  // Convert amountOut to BigNumber with appropriate decimals
  const amountOutBN = ethers.utils.parseUnits(amountOut, tokenOut.decimals);
  const quotedAmountIn = await quoterContract.callStatic.quoteExactOutput(
    path,
    amountOutBN
  );

  // Format the result to a readable string
  const formattedAmountIn = formatUnits(quotedAmountIn, tokenIn.decimals);
  // console.info(
  //   `Quoted Amount In: ${formattedAmountIn} ${tokenIn.symbol} for ${amountOut} ${tokenOut.symbol}`
  // );

  return formattedAmountIn;
};

export const getEncodedPath = (
  tokenIn: Token,
  tokenOut: Token
): `0x${string}` => {
  if (tokenIn.address === zeroAddress) {
    tokenIn = WETH;
  }

  if (tokenIn.address === tokenOut.address) {
    return tokenIn.address as `0x${string}`;
  }

  const bestRoute = getSwapRoutes(tokenIn, tokenOut);
  if (!bestRoute) {
    console.error("No route found");
    return "" as `0x${string}`;
  }

  const addressPath = bestRoute.path.map((token) => token.address).reverse();
  const feePath = bestRoute.fees.reverse();
  return encodePath(addressPath, feePath) as `0x${string}`;
};

// Helper function to encode the path
function encodePath(path: string[], fees: number[]): string {
  if (path.length !== fees.length + 1) {
    throw new Error("path/fee lengths do not match");
  }

  let encoded = "0x";
  for (let i = 0; i < fees.length; i++) {
    // 20 byte encoding of the address (normalized to lowercase)
    encoded += path[i].slice(2).toLowerCase();
    // 3 byte encoding of the fee
    encoded += fees[i].toString(16).padStart(6, "0");
  }
  // encode the final token (normalized to lowercase)
  encoded += path[path.length - 1].slice(2).toLowerCase();

  return encoded;
}
/**
 * Get a swap route between two tokens
 * Supports single-hop and multi-hop (up to 2 hops) swaps
 * @param tokenIn The input token
 * @param tokenOut The output token
 * @returns A route containing path and fees arrays, or undefined if no route found
 */
export function getSwapRoutes(
  tokenIn: Token,
  tokenOut: Token
): Route | undefined {
  const possibleRoutes: Route[] = [];

  // Check for direct routes (single-hop)
  for (const route of AVAILABLE_ROUTES) {
    // Check if the route matches our tokens (in either order)
    if (
      (route.tokenA.equals(tokenIn) && route.tokenB.equals(tokenOut)) ||
      (route.tokenA.equals(tokenOut) && route.tokenB.equals(tokenIn))
    ) {
      // Create the path in the correct order
      const path = route.tokenA.equals(tokenIn)
        ? [tokenIn, tokenOut]
        : [tokenIn, tokenOut];

      possibleRoutes.push({
        path,
        fees: [route.fee],
      });

      // If we found a direct route, return it immediately
      return possibleRoutes[0];
    }
  }

  // Find multi-hop routes (with one intermediate token)
  const availableIntermediates = new Set<Token>();

  // Find all tokens that tokenIn can swap to
  const tokenInConnections = AVAILABLE_ROUTES.filter(
    (route) => route.tokenA.equals(tokenIn) || route.tokenB.equals(tokenIn)
  );

  // Collect all possible intermediate tokens
  tokenInConnections.forEach((route) => {
    const intermediate = route.tokenA.equals(tokenIn)
      ? route.tokenB
      : route.tokenA;
    availableIntermediates.add(intermediate);
  });

  // For each intermediate token, check if it can swap to tokenOut
  availableIntermediates.forEach((intermediate) => {
    if (intermediate.equals(tokenOut)) return; // Skip if intermediate is the output token

    let firstHopRoute: AvailableRoute | undefined;
    let secondHopRoute: AvailableRoute | undefined;

    // Find the first hop route (tokenIn -> intermediate)
    firstHopRoute = AVAILABLE_ROUTES.find(
      (route) =>
        (route.tokenA.equals(tokenIn) && route.tokenB.equals(intermediate)) ||
        (route.tokenB.equals(tokenIn) && route.tokenA.equals(intermediate))
    );

    // Find the second hop route (intermediate -> tokenOut)
    secondHopRoute = AVAILABLE_ROUTES.find(
      (route) =>
        (route.tokenA.equals(intermediate) && route.tokenB.equals(tokenOut)) ||
        (route.tokenB.equals(intermediate) && route.tokenA.equals(tokenOut))
    );

    // If we found a complete path, add it to routes
    if (firstHopRoute && secondHopRoute) {
      const path = [tokenIn, intermediate, tokenOut];

      // Calculate fees in the correct order
      const firstHopFee = firstHopRoute.fee;
      const secondHopFee = secondHopRoute.fee;

      possibleRoutes.push({
        path,
        fees: [firstHopFee, secondHopFee],
      });
    }
  });

  // Return the first multi-hop route if we found any
  if (possibleRoutes.length > 0) {
    return possibleRoutes[0];
  }

  // No route found
  return undefined;
}
