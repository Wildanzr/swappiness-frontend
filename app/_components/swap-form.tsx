"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_TOKENS_IN, AVAILABLE_TOKENS_OUT } from "@/constants/tokens";
import Image from "next/image";
import { Spinner, Trash } from "@phosphor-icons/react/dist/ssr";
import TokenInputSelection from "./token-input";
import { Address, isAddress, parseUnits } from "viem";
import { getEncodedPath, quoteExactOutput } from "@/lib/qouter";
import { Token } from "@uniswap/sdk-core";
import { useDebounceCallback, useWindowSize } from "usehooks-ts";
import { delay, simplifyNumber } from "@/lib/utils";
import { useAccount } from "wagmi";
import DisperseButton from "./disperse-button";
import { disperseToStablecoins } from "@/web3/swappiness";
import Confetti from "react-confetti";
import { giveAllowance } from "@/web3/erc20";
import { waitForTransactionReceipt } from "@wagmi/core";
import {
  displayLoadingTx,
  displaySuccessAndExploreTx,
} from "@/components/shared/toast";
import { wagmiConfig } from "@/config/wagmi";
import toast from "react-hot-toast";

interface ToBeQuoted {
  tokenIn: Token;
  tokenOut: Token;
  amountOut: string;
}

const formSchema = z.object({
  tokenIn: z.custom<`0x${string}`>().refine((value) => isAddress(value), {
    message: "Please select a token",
  }),
  slippage: z.string().refine((value) => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
  }),
  receivers: z
    .object({
      address: z.custom<`0x${string}`>().refine((value) => isAddress(value), {
        message: "Invalid wallet address",
      }),
      tokenOut: z.custom<`0x${string}`>().refine((value) => isAddress(value), {
        message: "Please select a token",
      }),
      amount: z.string().refine((value) => {
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0;
      }),
    })
    .array()
    .min(1, "At least one receiver is required"),
});

const SwapForm = () => {
  const { address } = useAccount();
  const { height, width } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [tokenInput, setTokenInput] = useState<Token | undefined>(undefined);
  const [txState, setTxState] = useState<"approval" | "disperse">("approval");
  const [tobeQuoted, setToBeQuoted] = useState<ToBeQuoted[]>([]);
  const [quote, setQuote] = useState<number | undefined>(undefined);
  const [isQuoting, setIsQuoting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedToBeQuoted = useDebounceCallback(setToBeQuoted, 1000);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenIn: undefined,
      slippage: "2.5",
      receivers: [
        {
          address: "" as `0x${string}`,
          tokenOut: "" as `0x${string}`,
          amount: "",
        },
      ],
    },
  });

  // Add useFieldArray hook to handle the receivers array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "receivers",
  });

  const handleResetForm = () => {
    form.reset({
      tokenIn: undefined,
      slippage: "2.5",
      receivers: [
        {
          address: "" as `0x${string}`,
          tokenOut: "" as `0x${string}`,
          amount: "",
        },
      ],
    });
    setTokenInput(undefined);
    setToBeQuoted([]);
    setQuote(undefined);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 30000);
  };

  const handleDisperse = async (address: Address, tokenInput: Token) => {
    const quotes = await Promise.all(
      tobeQuoted.map(async (item) => {
        const quote = await quoteExactOutput(
          item.tokenIn,
          item.tokenOut,
          item.amountOut
        );
        const quoteNumber = parseFloat(quote);
        const slippage =
          (quoteNumber * Number(form.getValues("slippage"))) / 100;
        return parseUnits(
          (quoteNumber + slippage).toString(),
          item.tokenIn.decimals
        );
      })
    );

    const paths = tobeQuoted.map((item) =>
      getEncodedPath(item.tokenIn, item.tokenOut)
    );
    console.log("Quotes: ", quotes);
    const recipients = form.getValues("receivers").map((item) => item.address);
    const tokenOut = form.getValues("receivers").map((item) => item.tokenOut);
    const amountOut = form.getValues("receivers").map((item) => {
      const tokenOutInfo = AVAILABLE_TOKENS_OUT.find(
        (token) => token.token.address === item.tokenOut
      )?.token;
      return parseUnits(item.amount, tokenOutInfo?.decimals || 18);
    });

    const result = await disperseToStablecoins({
      tokenIn: tokenInput.address as Address,
      chainId: tokenInput.chainId,
      recipients,
      tokenOut,
      amountOut,
      amountInMax: quotes,
      paths: paths,
    });

    if (result === false) return;
    displayLoadingTx({
      message: "Transaction in progress...",
    });
    await waitForTransactionReceipt(wagmiConfig, {
      hash: result,
      chainId: tokenInput.chainId as 8453 | 31337 | undefined,
      confirmations: 1,
    });
    await delay(3000);
    displaySuccessAndExploreTx({
      message: "Transaction successful!",
      txHash: result,
    });

    handleResetForm();
  };

  const handleAllowance = async (address: Address, tokenInput: Token) => {
    const result = await giveAllowance(
      address,
      tokenInput.address as Address,
      tokenInput.chainId
    );
    if (result === false) return;
    displayLoadingTx({
      message: "Transaction in progress...",
    });
    await waitForTransactionReceipt(wagmiConfig, {
      hash: result,
      chainId: tokenInput.chainId as 8453 | 31337 | undefined,
      confirmations: 1,
    });
    await delay(3000);
    await handleDisperse(address, tokenInput);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!address) return;
      if (!tokenInput) return;
      setIsLoading(true);
      console.log(data);

      if (txState === "approval") {
        await handleAllowance(address, tokenInput);
      } else {
        await handleDisperse(address, tokenInput);
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Watch for changes in receivers' amounts and calculate quote
  useEffect(() => {
    const subscription = form.watch(async (value, { name }) => {
      if ((name?.includes("receivers") || name === "receivers") && tokenInput) {
        const tobeQouted: ToBeQuoted[] = [];

        value.receivers?.forEach((receiver) => {
          const amount = parseFloat(receiver?.amount || "0") || 0;

          // Add to tobeQouted if tokenOut is not undefined or empty and amount is valid
          if (receiver?.tokenOut && amount > 0) {
            const tokenOut = AVAILABLE_TOKENS_OUT.find(
              (item) => item.token.address === receiver.tokenOut
            )?.token as Token;

            tobeQouted.push({
              tokenIn: tokenInput,
              tokenOut: tokenOut,
              amountOut: amount.toString(),
            });
          }
        });

        // Only update toBeQuoted if it has changed
        const hasChanged =
          tobeQouted.length !== tobeQuoted.length ||
          tobeQouted.some(
            (item, index) =>
              !tobeQuoted[index] ||
              item.tokenIn.address !== tobeQuoted[index].tokenIn.address ||
              item.tokenOut.address !== tobeQuoted[index].tokenOut.address ||
              item.amountOut !== tobeQuoted[index].amountOut
          );

        if (hasChanged) {
          debouncedToBeQuoted(tobeQouted);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [debouncedToBeQuoted, form, form.watch, tokenInput, tobeQuoted]);

  useEffect(() => {
    const fetchQuotes = async () => {
      if (tobeQuoted.length > 0 && tokenInput) {
        console.log("To be quoted: ", tobeQuoted);
        setIsQuoting(true);
        const quotes = await Promise.all(
          tobeQuoted.map(async (item) => {
            const quote = await quoteExactOutput(
              item.tokenIn,
              item.tokenOut,
              item.amountOut
            );
            return parseFloat(quote);
          })
        );
        console.log("Quotes: ", quotes);

        // Calculate sum of all quotes
        const totalQuote = quotes.reduce((acc, curr) => acc + curr, 0);
        const slippage =
          (totalQuote * Number(form.getValues("slippage"))) / 100;
        console.log("2.5% fee: ", slippage);
        setQuote(totalQuote + slippage);
        setIsQuoting(false);
      } else {
        setQuote(undefined);
      }
    };

    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, tobeQuoted, tokenInput, form.watch("slippage")]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {showConfetti && <Confetti width={width} height={height} />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full min-w-md max-w-2xl h-full flex flex-col space-y-5"
        >
          <FormField
            control={form.control}
            name="tokenIn"
            render={({ field }) => (
              <FormItem className="gap-0">
                <FormLabel className="text-neutral-900 font-sans text-xl font-semibold">
                  Select source token
                </FormLabel>
                <FormDescription className="text-sm text-neutral-900 font-sans">
                  Token that you want to swap from
                </FormDescription>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setTokenInput(
                      AVAILABLE_TOKENS_IN.find(
                        (item) => item.token.address === value
                      )?.token
                    );
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="mt-3">
                      <SelectValue placeholder="Select token to swap from" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AVAILABLE_TOKENS_IN.map((item, idx) => (
                      <SelectItem key={idx} value={item.token.address}>
                        <TokenInputSelection item={item} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row items-center justify-between">
            <p className="text-neutral-900 font-sans text-xl font-semibold">
              Recipient(s)
            </p>

            <div className="flex flex-row gap-5">
              <Button variant="neutral" type="button">
                Import CSV
              </Button>
              <Button variant="neutral" type="button">
                Download Sample
              </Button>
            </div>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-8 gap-5 mb-2">
            <p className="text-neutral-900 col-span-4 font-sans font-medium">
              Wallet Address
            </p>
            <p className="text-neutral-900 col-span-2 font-sans font-medium">
              Token
            </p>
            <p className="text-neutral-900 col-span-2 font-sans font-medium">
              Amount
            </p>
          </div>

          {/* Recipients Fields */}
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-8 gap-5 mb-3">
              <FormField
                control={form.control}
                name={`receivers.${index}.address`}
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormControl>
                      <Input
                        disabled={tokenInput === undefined}
                        placeholder="0x123"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`receivers.${index}.tokenOut`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <Select
                      disabled={tokenInput === undefined}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AVAILABLE_TOKENS_OUT.map((item, idx) => (
                          <SelectItem key={idx} value={item.token.address}>
                            <div className="flex flex-row items-center justify-start space-x-4">
                              <Image
                                src={item.image}
                                alt={item.token.name!}
                                width={30}
                                height={30}
                                className="rounded-full bg-white p-1"
                              />
                              <p className="text-neutral-900 font-sans text-base font-semibold">
                                {item.token.symbol}
                              </p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-2 col-span-2 items-start justify-start">
                <FormField
                  control={form.control}
                  name={`receivers.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={tokenInput === undefined}
                          type="number"
                          id="amount"
                          autoComplete="off"
                          inputMode="decimal"
                          step="any"
                          placeholder="0"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === ",") {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const value = e.target.value.replace(",", ".");
                            field.onChange(value);
                          }}
                          className="bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="neutral"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  className="p-2 flex items-center justify-center"
                >
                  <Trash weight="bold" className="size-8 text-black" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex flex-row items-start justify-between pt-2">
            <div className="flex flex-row items-start justify-start gap-5">
              <Button
                type="button"
                onClick={() =>
                  append({
                    address: "" as `0x${string}`,
                    tokenOut: "" as `0x${string}`,
                    amount: "",
                  })
                }
                className="mt-2 w-fit"
                disabled={fields.length >= 10}
              >
                Add Recipients
              </Button>
              <FormField
                control={form.control}
                name={"slippage"}
                render={({ field }) => (
                  <FormItem className="gap-0">
                    <FormControl>
                      <div className="relative mt-2 max-w-32">
                        <Input
                          disabled={tokenInput === undefined}
                          type="number"
                          id="amount"
                          autoComplete="off"
                          inputMode="decimal"
                          step="any"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === ",") {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const value = e.target.value.replace(",", ".");
                            field.onChange(value);
                          }}
                          className="pr-16 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center text-sm pr-3 pointer-events-none text-gray-500">
                          % slippage
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {tokenInput && (
              <div className="flex flex-col items-end justify-start">
                <p className="text-black/50 font-sans text-base">Total</p>
                {isQuoting ? (
                  <Spinner className="animate-spin text-black/50 size-8" />
                ) : (
                  <p className="text-neutral-900 font-sans text-xl font-semibold">
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: tokenInput.decimals,
                    }).format(
                      // @ts-expect-error no types yet
                      simplifyNumber(
                        quote || 0 / 10 ** tokenInput.decimals,
                        tokenInput.decimals
                      )
                    )}{" "}
                    {tokenInput.symbol}
                  </p>
                )}
              </div>
            )}
          </div>

          <DisperseButton
            quote={quote}
            tokenInput={tokenInput}
            isLoading={isLoading}
            txState={txState}
            setTxState={setTxState}
            disabled={
              isQuoting ||
              tokenInput === undefined ||
              !form.formState.isValid ||
              address === undefined
            }
          />
        </form>
      </Form>
    </div>
  );
};

export default SwapForm;
