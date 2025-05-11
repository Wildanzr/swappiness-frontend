"use client";

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
import { motion } from "framer-motion";

const AboutPage = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8 } },
  };

  const stepAnimation = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="container mx-auto flex flex-col space-y-10 items-center justify-center h-full p-10"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.section className="w-full pt-5 min-w-sm" variants={fadeIn}>
        <div className="px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            variants={item}
          >
            <div className="space-y-2">
              <motion.div
                className="inline-block rounded-lg bg-main px-3 py-1 text-sm text-white"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                How It Works
              </motion.div>
              <motion.h2
                className="text-3xl font-bold tracking-tighter md:text-4xl"
                variants={item}
              >
                Token Swap?
              </motion.h2>
              <motion.h3
                className="text-xl font-bold tracking-tighter md:text-2xl text-main"
                variants={item}
              >
                We Vibe With Simple ✨
              </motion.h3>
              <motion.p
                className="text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                variants={item}
              >
                NGL, Swappiness is lowkey fire 🔥 - turning 8+ transactions into
                just 1. Less time, less fees, more vibes fr fr 💅
              </motion.p>
            </div>
          </motion.div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              variants={container}
            >
              <motion.ul className="grid gap-6" variants={container}>
                {[
                  {
                    step: "1",
                    title: "Connect Your Wallet 👛",
                    description:
                      "Link ur wallet bestie, it's giving secure vibes only ✨",
                  },
                  {
                    step: "2",
                    title: "Pick A Token 💰",
                    description:
                      "Choose which token hits different for you (ETH, USDC, DAI, whatevs)",
                  },
                  {
                    step: "3",
                    title: "Drop Those Addresses 📲",
                    description:
                      "Slide in those wallet addresses and spill which coin everyone's getting, no cap",
                  },
                  {
                    step: "4",
                    title: "Send It! 🚀",
                    description:
                      "One tap and you're done. Literally so fetch, like fr fr",
                  },
                ].map((step, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-4"
                    variants={stepAnimation}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <motion.div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-main text-black"
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <span className="font-bold">{step.step}</span>
                    </motion.div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-black/50">
                        {step.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div
              className="flex justify-center"
              variants={fadeIn}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full h-[420px] overflow-hidden rounded-lg p-8">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=420&width=400')] bg-cover bg-center opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4 text-center">
                  <motion.div
                    className="flex flex-col items-center space-y-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <motion.div
                      className="flex items-center justify-center w-16 h-16 rounded-full bg-main text-white"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <ArrowRightLeft className="h-8 w-8" />
                    </motion.div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Old School Way 💀</h3>
                      <p className="text-sm text-black/50">
                        So many txns, I can&apos;t even 😩
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="w-full border-t border-gray-200 dark:border-gray-800"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  ></motion.div>
                  <motion.div
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-main text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5, type: "spring" }}
                    whileHover={{
                      y: [-5, 0, -5],
                      transition: {
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                      },
                    }}
                  >
                    <ArrowRight className="h-6 w-6" />
                  </motion.div>
                  <motion.div
                    className="w-full border-t border-gray-200 dark:border-gray-800"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  ></motion.div>
                  <motion.div
                    className="flex flex-col items-center space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                  >
                    <motion.div
                      className="flex items-center justify-center w-16 h-16 rounded-full bg-main text-white"
                      whileHover={{ scale: 1.1, rotate: -10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <Wallet className="h-8 w-8" />
                    </motion.div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Swappiness Slay 💅</h3>
                      <p className="text-sm text-black/50">
                        Just 1 transaction, no cap fr fr 🔥
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full min-w-sm"
        variants={fadeIn}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            variants={item}
          >
            <div className="space-y-2">
              <motion.div
                className="inline-block rounded-lg bg-main px-3 py-1 text-sm text-white"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Use Cases
              </motion.div>
              <motion.h2
                className="text-3xl font-bold tracking-tighter md:text-4xl"
                variants={item}
              >
                Literally Endless Possibilities ✨🤩
              </motion.h2>
              <motion.p
                className="max-w-[900px] text-black/50 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                variants={item}
              >
                Low-key obsessed with how Swappiness can level up your token
                game? Same bestie! 💯🔥
              </motion.p>
            </div>
          </motion.div>
          <motion.div
            className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3"
            variants={container}
          >
            {[
              {
                icon: <Globe className="h-8 w-8 text-main" />,
                title: "Global Money Moves 🌍",
                description:
                  "Yeet those stablecoins across borders no cap! Zero stress, zero drama with the multi-tx life ✈️💸",
              },
              {
                icon: <Users className="h-8 w-8 text-main" />,
                title: "Payday Slay 💅",
                description:
                  "Remote squad gets their bag in whatever coin they're vibing with, one tap and done! So fetch! 💰👑",
              },
              {
                icon: <Wallet className="h-8 w-8 text-main" />,
                title: "Profit Szn 📈",
                description:
                  "Are u whaleess? Split 'em between wallets in literally one go. Whale tingz and it's giving efficiency 🐳✨",
              },
              {
                icon: <ArrowRightLeft className="h-8 w-8 text-main" />,
                title: "Diversify = Iconic 💯",
                description:
                  "Spread your tokens like tea sis! One tx and your portfolio's living its best life fr fr 🔄💎",
              },
              {
                icon: <Banknote className="h-8 w-8 text-main" />,
                title: "Refund Vibes 🤑",
                description:
                  "Customer refunds hitting different stables all at once? We ate that! No more basic multi-tx life 💁‍♂️💸",
              },
              {
                icon: <Users className="h-8 w-8 text-main" />,
                title: "Split The Bill Besties 👯‍♀️",
                description:
                  "Everyone gets their share in whatever coin they're simping for. Friend group economics just got upgraded! 🍕💯",
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Card className="h-52 overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      {useCase.icon}
                    </motion.div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-black/50">
                      {useCase.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default AboutPage;
