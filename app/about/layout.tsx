import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "About | Swap Easy, No Worries",
  description:
    "Learn about Swappiness, the platform that enables multi-token transfers in a single transaction. Discover our mission to simplify crypto payments and explore our various use cases.",
  keywords: [
    "About Swappiness",
    "Crypto payment platform",
    "Blockchain innovation",
    "DeFi solutions",
    "Stablecoin transfers",
    "Cross-border payments",
    "Salary distribution",
    "Portfolio diversification",
    "Crypto company",
    "Web3 innovation",
    "Blockchain efficiency",
    "Token transfer solution",
    "Ethereum dApp",
    "Crypto wages",
    "Stablecoin platform",
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
    title: "About Swappiness | Our Mission and Story",
    description:
      "Learn about the team behind Swappiness and our mission to revolutionize crypto payments by enabling multi-token transfers in a single transaction.",
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
    title: "About Swappiness | Our Mission and Story",
    description:
      "Learn about the team behind Swappiness and our mission to revolutionize crypto payments by enabling multi-token transfers in a single transaction.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
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
