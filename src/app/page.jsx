import React from "react";
import { cookies } from "next/headers";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Advantages from "@/components/Advantages";
import Footer from "@/components/Footer";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
// import { redirect } from "next/navigation";
const page = async () => {
  // const supabase = createServerComponentClient({ cookies });
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  // if (!session) {
  //   redirect("/login");
  // }
  return (
    <>
      <Navbar />
      <MaxWidthWrapper>
        <Hero />
        <Features />
        <Advantages />
        <Link href="/givework">give work</Link>
        <Link href="/regwork">register for work</Link>
        <Link href="/reggroup">register Group</Link>
        <Link href="/reghead">register as a head</Link>
        <Footer />
      </MaxWidthWrapper>
    </>
  );
};
export default page;
