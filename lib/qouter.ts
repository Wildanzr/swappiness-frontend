/* eslint-disable prefer-const */
import { QUOTER_ADDRESSES, Token } from "@uniswap/sdk-core";
import { base } from "viem/chains";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { ethers, providers } from "ethers";
import {
  AVAILABLE_TOKENS_IN,
  AVAILABLE_ROUTES,
  AVAILABLE_TOKENS_OUT,
  WETH,
} from "@/constants/tokens";
import { formatUnits, zeroAddress } from "viem";

const getProvider = (): providers.Provider => {
  return new ethers.providers.JsonRpcProvider(
    "https://base-mainnet.g.alchemy.com/v2/ZlzkGJhwX4ik8IQeDXVoM5A3YLbVIMpe"
  );
};

export const quoteExactOutput = async (
  // tokenIn: Token,
  // tokenOut: Token,
  amountOut: string
): Promise<string> => {
  let tokenIn = AVAILABLE_TOKENS_IN[0].token;
  const tokenOut = AVAILABLE_TOKENS_OUT[3].token;

  if (tokenIn.address === zeroAddress) {
    tokenIn = WETH;
  }

  const qouterAddress = QUOTER_ADDRESSES[base.id];
  const quoterContract = new ethers.Contract(
    qouterAddress,
    Quoter.abi,
    getProvider()
  );

  // const poolConstants = await getPoolConstants(tokenIn, tokenOut, 500);
  // console.log("Pool Constants: ", poolConstants);

  const bestRoute = getSwapRoutes(tokenIn, tokenOut);
  if (!bestRoute) {
    console.error("No route found");
    return "";
  }

  const addressPath = bestRoute.path.map((token) => token.address).reverse();
  const feePath = bestRoute.fees.reverse();

  console.log("Address Path: ", addressPath);
  console.log("Fee Path: ", feePath);

  const path = encodePath(addressPath, bestRoute.fees);

  console.log(
    "H0",
    "0x50c5725949a6f0c72e6c4a641f24049a917db0cb000064833589fcd6edb6e08f4c7c32d4f71b54bda029130001f44200000000000000000000000000000000000006"
  );
  console.log("H1", path);
  console.log(
    "Is Same: ",
    path ===
      "0x50c5725949a6f0c72e6c4a641f24049a917db0cb000064833589fcd6edb6e08f4c7c32d4f71b54bda029130001f44200000000000000000000000000000000000006"
  );

  // // Encode the path for the swap
  // For quoteExactOutput, the path needs to be encoded in reverse order (tokenOut, fee, tokenIn)
  // const path = encodePath0(
  //   [poolConstants.token0, poolConstants.token1],
  //   [poolConstants.fee]
  // );

  // Convert amountOut to BigNumber with appropriate decimals
  const amountOutBN = ethers.utils.parseUnits(amountOut, tokenOut.decimals);
  console.log("Amount Out: ", amountOutBN.toString());

  // Call the quoter contract to get the amount in needed for the desired amount out
  const quotedAmountIn = await quoterContract.callStatic.quoteExactOutput(
    path,
    amountOutBN
  );

  // Format the result to a readable string
  const formattedAmountIn = formatUnits(quotedAmountIn, tokenIn.decimals);

  console.log("Quoted Amount In: ", quotedAmountIn.toString());
  console.log("Formatted Amount In: ", formattedAmountIn);
  return formattedAmountIn;
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
  console.log("Token In: ", tokenIn.symbol);
  console.log("Token Out: ", tokenOut.symbol);
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

      console.log("Direct Route Found: ", possibleRoutes[0]);

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

  console.log("Multi-hop Routes Found: ", possibleRoutes);

  // Return the first multi-hop route if we found any
  if (possibleRoutes.length > 0) {
    return possibleRoutes[0];
  }

  // No route found
  return undefined;
}
