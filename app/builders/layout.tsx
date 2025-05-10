import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Builders | Meet Our Team",
  description:
    "Meet the team behind Swappiness. Get to know the builders who are developing the platform that enables multi-token transfers in a single transaction.",
  keywords: [
    "Swappiness team",
    "Swappiness builders",
    "DeFi developers",
    "Blockchain team",
    "Crypto innovators",
    "Swappiness founders",
    "Web3 engineers",
    "DeFi project team",
    "Blockchain entrepreneurs",
    "Ethereum developers",
    "Crypto startup team",
    "Swappiness leadership",
    "DeFi experts",
    "Stablecoin developers",
    "Crypto payment innovators",
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
    title: "Swappiness Builders | Meet Our Team",
    description:
      "Meet the talented team behind Swappiness who are building the future of multi-token transfers and revolutionizing crypto payments.",
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
    title: "Swappiness Builders | Meet Our Team",
    description:
      "Meet the talented team behind Swappiness who are building the future of multi-token transfers and revolutionizing crypto payments.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/builders`,
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
  return <Fragment>{children}</Fragment>;
}
