"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const formSchema = z.object({
  tokenIn: z.string().min(1, "Token In is required"),
  receivers: z
    .object({
      address: z.string().min(1, "Receiver address is required"),
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
      tokenIn: "",
      receivers: [
        {
          address: "",
          tokenOut: "",
          amount: 0,
        },
      ],
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl h-full flex flex-col space-y-5"
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
              <FormControl>
                <Input className="pt-2" placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SwapForm;
