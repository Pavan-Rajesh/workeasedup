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
// import { redirect } from "next/navigation";
const page = () => {
  // const supabase = createServerComponentClient({ cookies });
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  // if (!session) {
  //   redirect("/login");
  // }
  return (
    <>
      {/* <Navbar /> */}
      <div className="flex">
        <GlobeDemo />
        <Mainspotlight />
      </div>
      {/* <Hero /> */}

      <Features />
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
