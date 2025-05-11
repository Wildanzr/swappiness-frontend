import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Token } from "@uniswap/sdk-core";
import { quoteExactOutput } from "@/lib/qouter";
import { z } from "zod";
import { formSchema } from "./swap-form";

interface ToBeQuoted {
  tokenIn: Token;
  tokenOut: Token;
  amountOut: string;
}

export function useSwapQuotes(
  form: UseFormReturn<z.infer<typeof formSchema>>,
  tobeQuoted: ToBeQuoted[],
  tokenInput: Token | undefined
) {
  const [quote, setQuote] = useState<number | undefined>(undefined);
  const [isQuoting, setIsQuoting] = useState(false);

  useEffect(() => {
    const fetchQuotes = async () => {
      if (tobeQuoted.length > 0 && tokenInput) {
        setIsQuoting(true);
        try {
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
          console.info("Quotes: ", quotes);

          // Calculate sum of all quotes
          const totalQuote = quotes.reduce((acc, curr) => acc + curr, 0);
          const slippage =
            (totalQuote * Number(form.getValues("slippage"))) / 100;
          setQuote(totalQuote + slippage);
        } catch (error) {
          console.error("Error fetching quotes:", error);
          setQuote(undefined);
        } finally {
          setIsQuoting(false);
        }
      } else {
        setQuote(undefined);
      }
    };

    fetchQuotes();
  }, [tobeQuoted, tokenInput, form]);

  return { quote, isQuoting };
}
