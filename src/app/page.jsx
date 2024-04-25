"use client";
import React from "react";

// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/components/Navbar";
import Mainspotlight from "@/components/Mainspotlight";

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Advantages from "@/components/Advantages";
import Footer from "@/components/Footer";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { LampDemo } from "@/components/lamp";
import GlobeDemo from "@/components/Mainglobe";
import TextGenerateEffectDemo from "@/components/MainAbout";
// import { redirect } from "next/navigation";
const page = () => {
  // const supabase = createServerComponentClient({ cookies });
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

// <<<<<<< deploy
  // if (!session) {
  //   redirect("/login");
  // }
// =======
//   if (!session) {
//     redirect("/login");
//   }

// >>>>>>> main
  return (
    <>
      {/* <Navbar /> */}
      <div className="flex">
        <GlobeDemo />
        <Mainspotlight />
      </div>
      {/* <Hero /> */}

      <Features />

      <div className="h-[80vh] flex justify-center items-center flex-col text-center p-5">
        <h1 className="text-7xl my-5 underline-offset-8 underline decoration-2 decoration-primary">
          About Us
        </h1>
        <TextGenerateEffectDemo />
      </div>
      <LampDemo />

      {/* <Advantages /> */}
      {/* <Link href="/givework">give work</Link>
      <Link href="/regwork">register for work</Link>
      <Link href="/reggroup">register Group</Link>
      <Link href="/reghead">register as a head</Link> */}
      {/* <Footer /> */}
    </>
  );
};
export default page;
