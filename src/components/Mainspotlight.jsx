"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "./spotlight";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
export default function Mainspotlight() {
  return (
    <div className="h-screen w-full rounded-md  flex md:items-center md:justify-center bg-blue antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-30 md:-top-20" fill="none" />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10 text-left  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-left bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          WorkEase
        </h1>
        <br />
        <div className="mt-4 font-normal text-base text-neutral-300  text-left mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold"></h1>
          <h2 className="text-xl md:text-2xl text-gray-600 text-left font-bold">
            Bridging demand and supply gap of contractors and labors
          </h2>
          <br />
          <div>
            <Link
              className={buttonVariants({
                variant: "default",
                className: "px-8 md:px-10",
              })}
              href="/action"
            >
              Lets Work
            </Link>
            <Link
              className={buttonVariants({
                variant: "outline",
                className:
                  "px-8 md:px-10 ml-5 text-black border dark:text-white border-gray-400",
              })}
              href="/map"
            >
              See Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
