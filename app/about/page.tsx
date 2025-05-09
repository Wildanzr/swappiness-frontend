import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowRightLeft,
  ArrowRight,
  Wallet,
  Globe,
  Users,
  Banknote,
} from "lucide-react";
import React from "react";

const AboutPage = () => {
  return (
    <div className="container mx-auto flex flex-col space-y-10 items-center justify-center h-full">
      <section className="w-full pt-5 min-w-md">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-main px-3 py-1 text-sm text-white ">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Simplify Your Token Transfers
              </h2>
              <p className="text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Swappiness reduces 8+ transactions into just 1, saving you time
                and gas fees.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <ul className="grid gap-6">
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-main text-black">
                    <span className="font-bold">1</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Connect Your Wallet</h3>
                    <p className="text-sm text-black/50 ">
                      Link your crypto wallet to our secure platform.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-main text-black">
                    <span className="font-bold">2</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Select Source Token</h3>
                    <p className="text-sm text-black/50 ">
                      Choose which token you want to convert (ETH, USDC, DAI,
                      etc.).
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-main text-black">
                    <span className="font-bold">3</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Add Recipients</h3>
                    <p className="text-sm text-black/50 ">
                      Enter wallet addresses and specify which stablecoin and
                      amount each should receive.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-main text-black">
                    <span className="font-bold">4</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">One-Click Execution</h3>
                    <p className="text-sm text-black/50 ">
                      Confirm and execute all transfers in a single transaction.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full h-[420px] overflow-hidden rounded-lg p-8">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=420&width=400')] bg-cover bg-center opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-main text-white">
                      <ArrowRightLeft className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Traditional Method</h3>
                      <p className="text-sm text-black/50 ">
                        Lots of transactions
                      </p>
                    </div>
                  </div>
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-main text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-main text-white">
                      <Wallet className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Swappiness</h3>
                      <p className="text-sm text-black/50 ">
                        Just 1 transaction
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full min-w-md">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-main px-3 py-1 text-sm text-white">
                Use Cases
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Endless Possibilities
              </h2>
              <p className="max-w-[900px] text-black/50 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
                Discover how Swappiness can transform your token management.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Globe className="h-8 w-8 text-main" />
                <CardTitle className="text-xl">Cross-Border Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-black/50 ">
                  Send multiple stablecoins across borders without the
                  complexity of multiple transactions.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Users className="h-8 w-8 text-main" />
                <CardTitle className="text-xl">Salary Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-black/50 ">
                  Pay remote workers in their preferred stablecoins with a
                  single transaction.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Wallet className="h-8 w-8 text-main" />
                <CardTitle className="text-xl">Profit Splitting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-black/50 ">
                  Whales can take profit and split it among multiple wallets
                  efficiently.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <ArrowRightLeft className="h-8 w-8 text-main" />
                <CardTitle className="text-xl">
                  Portfolio Diversification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-black/50 ">
                  Diversify your holdings across multiple tokens in a single
                  transaction.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Banknote className="h-8 w-8 text-main" />
                <CardTitle className="text-xl">Merchant Refunds</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-black/50 ">
                  Process multiple customer refunds in different stablecoins at
                  once.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Users className="h-8 w-8 text-main" />
                <CardTitle className="text-xl">Expense Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-black/50 ">
                  Split expenses among friends or team members in their
                  preferred currencies.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
