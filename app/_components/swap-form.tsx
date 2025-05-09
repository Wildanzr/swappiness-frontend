"use client";

import React from "react";
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
import { Trash } from "@phosphor-icons/react/dist/ssr";
import TokenInputSelection from "./token-input";
import { isAddress } from "viem";

const formSchema = z.object({
  tokenIn: z.custom<`0x${string}`>().refine((value) => isAddress(value), {
    message: "Invalid token address",
  }),
  receivers: z
    .object({
      address: z.custom<`0x${string}`>().refine((value) => isAddress(value), {
        message: "Invalid wallet address",
      }),
      tokenOut: z.string().min(1, "Token Out is required"),
      amount: z.number().min(1, "Amount is required"),
    })
    .array()
    .min(1, "At least one receiver is required"),
});

const SwapForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenIn: undefined,
      receivers: [
        {
          address: undefined,
          tokenOut: "",
          amount: 0,
        },
      ],
    },
  });

  // Add useFieldArray hook to handle the receivers array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "receivers",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      placeholder="0x123"
                      {...field}
                      className="bg-white"
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
                        type="text"
                        placeholder="e.g., 100"
                        value={field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === "" ? "" : Number(e.target.value);
                          field.onChange(value);
                        }}
                        className="bg-white"
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

        <Button
          type="button"
          onClick={() =>
            append({ address: "0x" as `0x${string}`, tokenOut: "", amount: 0 })
          }
          className="mt-2 w-fit"
          disabled={fields.length >= 10}
        >
          Add Recipients
        </Button>

        <Button type="submit" className="w-full text-lg font-semibold p-5">
          Approve Token
        </Button>
      </form>
    </Form>
  );
};

export default SwapForm;
