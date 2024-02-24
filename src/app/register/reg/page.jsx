"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Formfield from "@/components/Formfield";
import { DatePickerDemo } from "@/components/ui/calender";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
export default function Login() {
  const [useremail, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [phonenumber, setPhonenumber] = useState(null);
  const [address, setAddress] = useState(null);
  const [date, setDate] = useState(null);
  const [aadhar, setaadhar] = useState(null);
  const [name, setName] = useState(null);

  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email: useremail,
      password,
      phone: phonenumber,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    const userData = {
      name,
      aadhar,
      date,
      address,
      phonenumber,
      useremail,
    };
    fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    router.refresh();
  };

  // const handleSignIn = async () => {
  //   await supabase.auth.signInWithPassword({
  //     email: useremail,
  //     password,
  //   });
  //   router.refresh();
  // };

  // const handleSignOut = async () => {
  //   await supabase.auth.signOut();
  //   router.refresh();
  // };

  return (
    <>
      {/* <Navbar /> */}

      <div className="flex justify-center contents-center flex-col w-full px-5 py-2  md:w-2/4">
        {/* <header className="text-xl font-bold  py-2 mb-5 border-b-2 border-primary flex justify-between items-center">
          <h1>WorkEase - Register</h1>
          <Link href="/" className={buttonVariants({ variant: "link" })}>
            Home
          </Link>
        </header> */}
        <Formfield>
          <Label>Name</Label>
          <Input type="text" onChange={(e) => setName(e.target.value)} />
        </Formfield>
        <Formfield>
          <Label>Email</Label>
          <Input name="email" onChange={(e) => setEmail(e.target.value)} />
        </Formfield>
        <Formfield>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Formfield>
        <Formfield>
          <Label>Address</Label>
          <Input
            type="text"
            name="Address"
            onChange={(e) => setAddress(e.target.value)}
          />
        </Formfield>
        <Formfield>
          <Label>Date Of Birth</Label>
          <Input
            type="date"
            name="date"
            onChange={(e) => setDate(e.target.value)}
          />
          {/* <DatePickerDemo /> */}
        </Formfield>
        <Formfield>
          <Label>Aadhar</Label>
          <Input
            type="text"
            name="aadhar"
            onChange={(e) => setaadhar(e.target.value)}
          />
        </Formfield>
        <Formfield>
          <Label>Phonenumber</Label>
          <Input
            type="text"
            name="phonenumber"
            onChange={(e) => setPhonenumber(e.target.value)}
          />
        </Formfield>
        <Formfield>
          <Button className="w-full my-3" onClick={handleSignUp}>
            Sign up
          </Button>
        </Formfield>
      </div>

      {/* <Button onClick={handleSignIn}>Sign in</Button> */}
      {/* <button onClick={handleSignOut}>Sign out</button> */}
    </>
  );
}
