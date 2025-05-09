import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const simplifyNumber = (
  value: number,
  tokenDecimals: number
): string => {
  // Determine display decimals based on token decimals
  let displayDecimals;
  if (tokenDecimals >= 18) {
    displayDecimals = 5; // High precision for tokens like ETH
  } else if (tokenDecimals >= 8) {
    displayDecimals = 4; // Medium precision for tokens like BTC
  } else {
    displayDecimals = 2; // Low precision for tokens like USDC
  }

  const factor = Math.pow(10, displayDecimals);
  const truncatedValue = Math.floor(value * factor) / factor;

  return truncatedValue.toFixed(displayDecimals).replace(/\.?0+$/, ""); // Remove trailing zeros
};
