"use client";
import React from "react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import GlobeDemo from "./Mainglobe";
const Hero = () => {
  return (
    <section className="text-center py-4 h-[88vh] gap-8 flex justify-center content-center flex-col">
      <h1 className="text-5xl md:text-6xl font-bold">WorkEase</h1>
      <h2 className="text-xl md:text-2xl text-gray-600 font-bold">
        Bridging demand and supply gap of contractors and labors
      </h2>
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
    </section>
  );
};

export default Hero;
