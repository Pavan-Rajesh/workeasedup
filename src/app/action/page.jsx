import Navbar from "@/components/Navbar";
import React from "react";
import Footer from "@/components/Footer";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
const page = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/register");
  }
  return (
    <>
      <Navbar />
      <div>
        <h1>welcome{session.user.email}</h1>
        <h3>
          Give work to others Register a work (search for workers){" "}
          <Link href={"/givework"}>register a work</Link>
        </h3>
        <h3>
          Register as worker in search for work
          <Link href={"/regwork"}>register for work</Link>
        </h3>
        <h3>
          Register as Head
          <Link href={"/reghead"}>register as head</Link>
        </h3>
        <h3>
          Modify workers to add or delete the workers - Feature available only
          for head
          <Link href={"/seleworkers"}>modify workers</Link>
        </h3>
        <h3>
          See locations of workers and owners on the map
          <Link href={"/map"}>Get locations of contractors and workers</Link>
        </h3>
      </div>
      <Footer />
    </>
  );
};

export default page;
