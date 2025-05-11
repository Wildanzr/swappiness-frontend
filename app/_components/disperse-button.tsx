"use client";

import { Button } from "@/components/ui/button";
import { SWAPPINESS_ADDRESS } from "@/constants/contracts";
import { ERC20_ABI } from "@/constants/erc20-abi";
import { Spinner } from "@phosphor-icons/react/dist/ssr";
import { Token } from "@uniswap/sdk-core";
import { Address, formatUnits, parseUnits, zeroAddress } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { useEffect, useState } from "react";

interface DisperseButtonProps {
  disabled: boolean;
  quote: number | undefined;
  tokenInput: Token | undefined;
  isLoading: boolean;
  txState: "approval" | "disperse";
  setTxState: React.Dispatch<React.SetStateAction<"approval" | "disperse">>;
}

const DisperseButton = ({
  disabled,
  quote,
  tokenInput,
  isLoading,
  txState,
  setTxState,
}: DisperseButtonProps) => {
  const { address } = useAccount();
  const [hasInsufficientBalance, setHasInsufficientBalance] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render key

  const { data: tokenBalance, isLoading: isLoadingTokenBalance } =
    useReadContract({
      address: tokenInput?.address as Address,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address as Address],
      chainId: tokenInput?.chainId,
      query: {
        enabled:
          !!address &&
          tokenInput !== undefined &&
          tokenInput.address !== zeroAddress,
        staleTime: 0,
        refetchInterval: 5 * 1000, // 5 seconds
      },
    });

  const { data: nativeBalance, isLoading: isLoadingNativeBalance } = useBalance(
    {
      address: address as Address,
      chainId: tokenInput?.chainId,
      query: {
        enabled:
          !!address &&
          tokenInput !== undefined &&
          tokenInput?.address === zeroAddress,
        staleTime: 0,
        refetchInterval: 5 * 1000, // 5 seconds
      },
    }
  );

  const { data: allowance, isLoading: isAllowanceLoading } = useReadContract({
    abi: ERC20_ABI,
    address: tokenInput?.address as Address,
    functionName: "allowance",
    args: [address as Address, SWAPPINESS_ADDRESS as Address],
    chainId: tokenInput?.chainId,
    query: {
      enabled:
        !!address &&
        tokenInput !== undefined &&
        tokenInput.address !== zeroAddress,
      staleTime: 0,
      refetchInterval: 5 * 1000, // 5 seconds
    },
  });

  // Check if balance is sufficient using useEffect
  useEffect(() => {
    if (!quote || quote <= 0 || !tokenInput) {
      setHasInsufficientBalance(false);
      return;
    }

    let insufficientBalance = false;
    if (tokenInput.address === zeroAddress) {
      insufficientBalance = nativeBalance
        ? parseFloat(nativeBalance.formatted) < quote
        : false;
    } else {
      insufficientBalance = tokenBalance
        ? parseFloat(formatUnits(tokenBalance as bigint, tokenInput.decimals)) <
          quote
        : false;
    }

    setHasInsufficientBalance(insufficientBalance);
  }, [quote, tokenInput, nativeBalance, tokenBalance]);

  // Determine if approval is needed and set state accordingly using useEffect
  useEffect(() => {
    // Skip if native token or no token/quote
    if (!tokenInput || tokenInput.address === zeroAddress || !quote) {
      if (txState !== "disperse") {
        setTxState("disperse");
        setForceUpdate((prev) => prev + 1); // Force re-render
      }
      return;
    }

    // Check if approval is needed
    if (allowance !== undefined) {
      const isApprovalNeeded =
        (allowance as bigint) <
        parseUnits(quote.toString(), tokenInput.decimals);

      // Update state based on approval need
      if (isApprovalNeeded && txState !== "approval") {
        setTxState("approval");
        setForceUpdate((prev) => prev + 1); // Force re-render
      } else if (!isApprovalNeeded && txState === "approval") {
        setTxState("disperse");
        setForceUpdate((prev) => prev + 1); // Force re-render
      }
    }
  }, [allowance, tokenInput, quote, txState, setTxState]);

  return (
    <Button
      key={`button-${txState}-${forceUpdate}`} // Add a key to force re-render when state changes
      disabled={
        disabled ||
        isLoading ||
        isLoadingNativeBalance ||
        isLoadingTokenBalance ||
        isAllowanceLoading ||
        hasInsufficientBalance ||
        !tokenInput
      }
      type="submit"
      className="text-lg font-semibold cursor-pointer"
    >
      {/* Inline button content calculation using JSX */}
      {isLoading ? (
        <Spinner className="animate-spin text-black/50 size-8" />
      ) : tokenInput === undefined ? (
        "Select Source Token"
      ) : (tokenInput.address === zeroAddress && isLoadingNativeBalance) ||
        (tokenInput.address !== zeroAddress && isLoadingTokenBalance) ||
        isAllowanceLoading ? (
        <Spinner className="animate-spin text-black/50 size-8" />
      ) : hasInsufficientBalance ? (
        "Insufficient Balance"
      ) : tokenInput.address === zeroAddress ? (
        `Disperse ${tokenInput.symbol}`
      ) : txState === "approval" ? (
        `Approve ${tokenInput.symbol}`
      ) : (
        `Disperse ${tokenInput.symbol}`
      )}
    </Button>
  );
};

export default DisperseButton;
