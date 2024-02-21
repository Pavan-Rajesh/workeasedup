import React from "react";
import { Button, buttonVariants } from "./ui/button";

const Hero = () => {
  return (
    <section className="text-center py-4 h-96 gap-8 flex justify-center content-center flex-col">
      <h1 className="text-5xl md:text-6xl font-bold">WorkEase</h1>
      <h2 className="text-xl md:text-2xl text-gray-600 font-bold">
        Bridging demand and supply gap of contractors and labors
      </h2>
      <div className="">
        <Button className="px-8 md:px-10">Lets Work</Button>
        <Button
          className={buttonVariants({
            variant: "outline",
            class: "px-8 md:px-10 ml-5 text-black border border-gray-400",
          })}
        >
          See Map
        </Button>
      </div>
    </section>
  );
};

export default Hero;
