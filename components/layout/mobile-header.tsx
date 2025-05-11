"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { List } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Separator } from "../ui/separator";

const MobileHeaderLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild className="lg:hidden">
        <Button size="icon" className="rounded-full">
          <List className="text-black size-8" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-[300px] pt-4">
          <DrawerHeader>
            <Link href="/" onClick={toggleDrawer}>
              <DrawerTitle>
                <p className="text-2xl font-sans text-start font-medium text-black">
                  Swap<span className="text-coinbase">piness</span>
                </p>
              </DrawerTitle>
            </Link>
            <DrawerDescription className="hidden" />
          </DrawerHeader>

          <Separator className="my-2" />
        </div>
        <div className="flex pb-5 flex-col items-start justify-start p-5 gap-5">
          <Link href="/about" onClick={toggleDrawer}>
            <p className="text-lg font-sans font-medium text-black hover:text-coinbase transition-all duration-300">
              About
            </p>
          </Link>
          <Link href="/builders" onClick={toggleDrawer}>
            <p className="text-lg font-sans font-medium text-black hover:text-coinbase transition-all duration-300">
              Builders
            </p>
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileHeaderLayout;
