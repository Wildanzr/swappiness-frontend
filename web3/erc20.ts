import { ERC20_ABI } from "@/constants/erc20-abi";
import { Address } from "viem";
import { writeContract } from "@wagmi/core";
import { wagmiConfig } from "@/config/wagmi";
import { SWAPPINESS_ADDRESS } from "@/constants/contracts";

export const giveAllowance = async (
  user: Address,
  token: Address,
  chainId: number
) => {
  const maxAmount = BigInt(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  );
  try {
    const result = await writeContract(wagmiConfig, {
      abi: ERC20_ABI,
      address: token,
      functionName: "approve",
      args: [SWAPPINESS_ADDRESS as Address, maxAmount],
      account: user,
      chainId: chainId as 8453 | 31337,
    });

    return result;
  } catch (error) {
    console.error("Error giving allowance:", error);
    return false;
  }
};
