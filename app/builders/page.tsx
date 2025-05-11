"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { XLogo } from "@phosphor-icons/react/dist/ssr";

const BuildersPage = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const teamMembers = [
    {
      id: 1,
      handle: "wildanzrrr",
      role: "Solo Dev ⚡💻",
      description:
        "No cap, this dude eats bugs and simps Chinese queens 24/7. Real ones know the vibes! 💯.",
      pfp: "/assets/Ti2xAVZ3_400x400.jpg",
      twitter: "https://x.com/wildanzrrr",
      github: "https://github.com/wildanzrrr",
    },
    {
      id: 2,
      handle: "Chorneliusyoshi",
      role: "Fibonacci Designer 📈🔄",
      description:
        "Chart addict and full-time hopium dealer. Buys high, sells higher. WAGMI! 🚀",
      pfp: "/assets/QA09tpvj_400x400.jpeg",
      twitter: "https://x.com/Chorneliusyoshi",
      github: "https://github.com/Chorneliusyoshi",
    },
    {
      id: 3,
      handle: "AfifUi",
      role: "GM! GM! GM! 🌞🎨",
      description:
        "First to GM, last to GN. Designs interfaces while yapping anywhere. Real Butterfly vibes! 🦋",
      pfp: "/assets/0WtZXxgW_400x400.jpeg",
      twitter: "https://x.com/AfifUi",
      github: "https://github.com/AfifUi",
    },
  ];

  return (
    <div className="container mx-auto flex flex-col space-y-10 items-center justify-center h-full p-10">
      {/* Team Header */}
      <motion.div
        className="container mx-auto mb-16 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-coinbase">
          Meet Our Team ✨
        </h1>
        <p className="text-lg text-black/70 max-w-2xl mx-auto">
          The brilliant minds behind Swappiness 🚀👻
        </p>
      </motion.div>

      {/* Team Grid */}
      <div className="container mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{
                y: -10,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              onMouseEnter={() => setActiveCard(member.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <Card className="overflow-hidden h-full border border-black/10">
                <div className="p-6 flex justify-center">
                  <motion.div
                    className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-main ring-4 ring-main/20"
                    animate={{
                      scale: activeCard === member.id ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={member.pfp || "/placeholder.svg"}
                      alt={`${member.handle}'s profile picture`}
                      className="w-full h-full object-cover"
                      fill
                      sizes="100%"
                    />
                  </motion.div>
                </div>
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-xl text-coinbase">
                    {member.handle}
                  </CardTitle>
                  <p className="text-sm font-medium text-black">
                    {member.role}
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-black/50 text-sm">{member.description}</p>
                </CardContent>
                <CardFooter className="flex justify-center gap-3 pb-6">
                  <Button size="icon" className="" asChild>
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.handle}'s Twitter`}
                    >
                      <XLogo className="size-5" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BuildersPage;
