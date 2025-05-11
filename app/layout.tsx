import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { getServerSession, Session } from "next-auth";
import { authConfig } from "@/config/auth";
import { headers } from "next/headers";
import WrapperLayout from "@/components/layout/wrapper";
import { Toaster } from "react-hot-toast";

const coinbaseDisplay = localFont({
  src: [
    {
      path: "../public/assets/fonts/Coinbase_Display-Extra_Light-web-1.32.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Coinbase_Display-Light-web-1.32.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Coinbase_Display-Regular-web-1.32.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Coinbase_Display-Medium-web-1.32.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Coinbase_Display-Bold-web-1.32.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-coinbase-display",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Swappiness | Swap Easy, No Worries",
  description:
    "Send multiple stablecoins to different addresses in a single transaction. Simplify cross-border payments, salary distribution, portfolio management, and more with Swappiness.",
  keywords: [
    "Multi-token transfer",
    "Stablecoin transfers",
    "Cross-border payments",
    "Salary distribution",
    "Portfolio diversification",
    "DeFi tools",
    "USDC transfers",
    "DAI transfers",
    "IDRX transfers",
    "EURC transfers",
    "Crypto batch payments",
    "Token swapping",
    "Ethereum transactions",
    "Web3 payments",
    "Blockchain efficiency",
  ],
  creator: "Swappiness",
  authors: {
    name: "Swappiness",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  publisher: "Swappiness",
  applicationName: "Swappiness",
  twitter: {
    card: "summary_large_image",
    title: "Swappiness | Multi-Token Transfers Made Simple",
    description:
      "Send multiple stablecoins to different addresses in a single transaction. Simplify cross-border payments, salary distribution, portfolio management, and more.",
    creator: "@swappiness",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/assets/icons/536.svg`,
        width: 1200,
        height: 630,
      },
    ],
  },
  openGraph: {
    title: "Swappiness | Multi-Token Transfers Made Simple",
    description:
      "Send multiple stablecoins to different addresses in a single transaction. Simplify cross-border payments, salary distribution, portfolio management, and more.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Swappiness",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/assets/icons/536.svg`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = (await getServerSession(authConfig)) as Session;
  const cookie = (await headers()).get("cookie") as string;
  return (
    <html lang="en">
      <body
        className={`${coinbaseDisplay.variable} font-sans bg-[#DDE9F3] text-neutral-900 antialiased`}
      >
        <AuthProvider session={session} cookie={cookie}>
          <WrapperLayout>
            {children}
            <Toaster
              toastOptions={{
                duration: 3000,
                position: "top-right",
              }}
            />
          </WrapperLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
