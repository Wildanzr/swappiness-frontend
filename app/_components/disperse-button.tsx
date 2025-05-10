"use client";

import { Button } from "@/components/ui/button";
import { SWAPPINESS_ADDRESS } from "@/constants/contracts";
import { ERC20_ABI } from "@/constants/erc20-abi";
import { Spinner } from "@phosphor-icons/react/dist/ssr";
import { Token } from "@uniswap/sdk-core";
import { Address, formatUnits, parseUnits, zeroAddress } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { giveAllowance } from "@/web3/erc20";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import useWaitForTxAction from "@/hooks/use-wait-for-tx";

interface DisperseButtonProps {
  disabled: boolean;
  quote: number | undefined;
  tokenInput: Token | undefined;
  handleDisperse: () => Promise<false | `0x${string}`>;
  handleResetForm: () => void;
}

const DisperseButton = ({
  disabled,
  quote,
  tokenInput,
  handleDisperse,
  handleResetForm,
}: DisperseButtonProps) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<Address | undefined>();
  const [state, setState] = useState<"approval" | "disperse">("approval");
  const [hasInsufficientBalance, setHasInsufficientBalance] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render key

  const handlePostAction = async () => {
    if (state === "approval") {
      console.log("Done Approval");
      setState("disperse");
      setForceUpdate((prev) => prev + 1); // Force re-render
      setTxHash(undefined);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      console.log("Disperse now");
      try {
        setIsLoading(true);
        const result = await handleDisperse();
        if (result === false) return;
        setTxHash(result);
      } catch (error) {
        console.error("Transaction failed:", error);
        toast.error("Transaction failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Done Disperse");
      displaySuccessAndExploreTx(txHash);
      setTxHash(undefined);
      handleResetForm();
    }
  };

  useWaitForTxAction({
    action: handlePostAction,
    txHash: txHash,
    chainId: tokenInput?.chainId,
  });

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

  const displayLoadingTx = () => {
    toast.custom((t) => (
      <div
        className={cn(
          "flex flex-row items-center justify-start space-x-2 bg-main text-black p-4 rounded-lg border-2 border-border",
          t.visible ? "animate-enter" : "animate-leave"
        )}
      >
        <Spinner
          className="text-black animate-spin size-5"
          onClick={() => toast.dismiss(t.id)}
        />
        <p className="text-neutral-20 text-label">
          Transaction submitted, waiting for confirmation...
        </p>
      </div>
    ));
  };

  const displaySuccessAndExploreTx = (txHash: Address | undefined) => {
    toast.custom((t) => (
      <div
        className={cn(
          "flex flex-row items-center justify-start space-x-2 bg-main text-black p-4 rounded-lg border-2 border-border",
          t.visible ? "animate-enter" : "animate-leave"
        )}
      >
        <p className="text-black text-label">Transaction successful! </p>
        <Link
          href={`https://basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black underline"
        >
          View on BaseScan
        </Link>
      </div>
    ));
  };

  const handleAllowance = async () => {
    if (!address) return;
    if (!tokenInput) return;

    try {
      setIsLoading(true);
      const result = await giveAllowance(
        address,
        tokenInput.address as Address,
        tokenInput.chainId
      );
      if (result === false) return;
      setTxHash(result);
      displayLoadingTx();
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async () => {
    if (!address) return;
    if (!tokenInput) return;

    if (state === "approval") {
      await handleAllowance();
    } else {
      try {
        setIsLoading(true);
        const result = await handleDisperse();
        if (result === false) return;
        setTxHash(result);
      } catch (error) {
        console.error("Transaction failed:", error);
        toast.error("Transaction failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

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
      if (state !== "disperse") {
        setState("disperse");
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
      if (isApprovalNeeded && state !== "approval") {
        setState("approval");
        setForceUpdate((prev) => prev + 1); // Force re-render
      } else if (!isApprovalNeeded && state === "approval") {
        setState("disperse");
        setForceUpdate((prev) => prev + 1); // Force re-render
      }
    }
  }, [allowance, tokenInput, quote, state]);

  return (
    <Button
      key={`button-${state}-${forceUpdate}`} // Add a key to force re-render when state changes
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
      onClick={handleClick}
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
      ) : state === "approval" ? (
        `Approve ${tokenInput.symbol}`
      ) : (
        `Disperse ${tokenInput.symbol}`
      )}
    </Button>
  );
};

export default DisperseButton;
