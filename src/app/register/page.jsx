"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

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

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email: useremail,
      password,
    });
    router.refresh();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      <Navbar />
      <label>name</label>
      <input type="text" onChange={(e) => setName(e.target.value)} />

      <label>email</label>
      <input name="email" onChange={(e) => setEmail(e.target.value)} />
      <label>password</label>
      <input
        type="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <label>Address</label>
      <input
        type="text"
        name="Address"
        onChange={(e) => setAddress(e.target.value)}
      />
      <label>DOB</label>
      <input
        type="date"
        name="date"
        onChange={(e) => setDate(e.target.value)}
      />
      <label>Aadhar</label>
      <input
        type="text"
        name="aadhar"
        onChange={(e) => setaadhar(e.target.value)}
      />
      <label>phonenumber</label>
      <input
        type="text"
        name="phonenumber"
        onChange={(e) => setPhonenumber(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign up</button>
      <button onClick={handleSignIn}>Sign in</button>
      <button onClick={handleSignOut}>Sign out</button>
    </>
  );
}
