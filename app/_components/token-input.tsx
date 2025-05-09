import React from "react";
import Image from "next/image";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { ERC20_ABI } from "@/constants/erc20-abi";
import { Address, zeroAddress } from "viem";
import { simplifyNumber } from "@/lib/utils";

interface TokenInputSelectionProps {
  item: AvailableToken;
}

const TokenInputSelection = ({ item }: TokenInputSelectionProps) => {
  const { address } = useAccount();
  const { data: tokenBalance, isLoading: isTokenBalanceLoading } =
    useReadContract({
      address: item.token.address as Address,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address as Address],
      chainId: item.token.chainId,
      query: {
        enabled: !!address && item.token.address !== zeroAddress,
        staleTime: 0,
        refetchInterval: 30 * 1000, // 30 seconds
      },
    });
  const { data: nativeBalance, isLoading: isNativeBalanceLoading } = useBalance(
    {
      address: address as Address,
      chainId: item.token.chainId,
      query: {
        enabled: !!address && item.token.address === zeroAddress,
        staleTime: 0,
        refetchInterval: 30 * 1000, // 30 seconds
      },
    }
  );

  // Determine if we're in a loading state
  const isLoading =
    item.token.address === zeroAddress
      ? isNativeBalanceLoading
      : isTokenBalanceLoading;

  return (
    <div className="flex flex-row items-center justify-start space-x-4">
      <div className="flex flex-row items-center justify-start space-x-2">
        <Image
          src={item.image}
          alt={item.token.name!}
          width={30}
          height={30}
          className="rounded-full bg-white p-1"
        />
        <p className="text-neutral-900 font-sans text-base font-semibold">
          {item.token.name}
        </p>
      </div>

      {address && (
        <p className="text-neutral-900 font-sans text-sm font-normal">
          {isLoading ? (
            <span className="inline-block w-12 h-4 bg-gray-200 animate-pulse rounded">
              &nbsp;
            </span>
          ) : (
            <>
              {item.token.address === zeroAddress
                ? new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: item.token.decimals,
                  }).format(
                    // @ts-expect-error no types yet
                    simplifyNumber(
                      Number(nativeBalance?.value) / 10 ** item.token.decimals,
                      item.token.decimals
                    )
                  )
                : new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: item.token.decimals,
                  }).format(
                    // @ts-expect-error no types yet
                    simplifyNumber(
                      Number(tokenBalance) / 10 ** item.token.decimals,
                      item.token.decimals
                    )
                  )}{" "}
              {item.token.symbol}
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default TokenInputSelection;
