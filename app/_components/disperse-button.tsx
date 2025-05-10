import { Button } from "@/components/ui/button";
import { Token } from "@uniswap/sdk-core";
import React from "react";

interface DisperseButtonProps {
  disabled: boolean;
  quote: number | undefined;
  tokenInput: Token | undefined;
}

const DisperseButton = ({ disabled }: DisperseButtonProps) => {
  return (
    <Button
      disabled={disabled}
      type="submit"
      className="w-full text-lg font-semibold p-5"
    >
      Get Quote
    </Button>
  );
};

export default DisperseButton;
