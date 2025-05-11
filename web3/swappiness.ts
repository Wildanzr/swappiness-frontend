import { Address, zeroAddress } from "viem";
import { writeContract } from "@wagmi/core";
import { wagmiConfig } from "@/config/wagmi";
import { SWAPPINESS_ADDRESS } from "@/constants/contracts";
import { SWAPPINESS_ABI } from "@/constants/swappiness-abi";

interface DisperseToStablecoinsProps {
  tokenIn: Address;
  recipients: Address[];
  tokenOut: Address[];
  amountOut: bigint[];
  amountInMax: bigint[];
  paths: `0x${string}`[];
  chainId: number;
}

export const disperseToStablecoins = async ({
  tokenIn,
  recipients,
  tokenOut,
  amountOut,
  amountInMax,
  paths,
  chainId,
}: DisperseToStablecoinsProps) => {
  // console.info("Dispersing to stablecoins...", {
  //   tokenIn,
  //   recipients,
  //   tokenOut,
  //   amountOut,
  //   amountInMax,
  //   paths,
  //   chainId,
  // });

  try {
    const maxAmount = amountInMax.reduce(
      (acc, curr) => acc + BigInt(curr),
      BigInt(0)
    );
    const result = await writeContract(wagmiConfig, {
      abi: SWAPPINESS_ABI,
      address: SWAPPINESS_ADDRESS,
      functionName: "disperseToStablecoins",
      args: [tokenIn, recipients, tokenOut, amountOut, amountInMax, paths],
      chainId: chainId as 8453 | 31337,
      value: tokenIn === zeroAddress ? maxAmount : undefined,
    });

    return result;
  } catch (error) {
    console.error("Error dispersing to stablecoins:", error);
    return false;
  }
};
