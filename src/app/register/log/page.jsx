"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Formfield from "@/components/Formfield";
import validator from "validator";
import { toast } from "sonner";
export default function Login() {
  const [useremail, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    if (!validator.isEmail(useremail)) {
      toast.error("enter valid email");
      return;
    }
    const loading = toast.loading("signing you in");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: useremail,
      password,
    });

    if (error) {
      toast.dismiss(loading);
      toast.error("invalid credintials");
    } else {
      toast.dismiss(loading);
      toast.success("successfully logged in");
      router.push("/");
    }
  };

  // const handleSignOut = async () => {
  //   await supabase.auth.signOut();
  //   router.refresh();
  // };

  return (
    <>
      {/* <Navbar /> */}

      <div className="flex justify-center contents-center flex-col w-full px-5 py-2  md:w-2/4">
        {/* <header className="text-xl font-bold  py-2 mb-5 border-b-2 border-primary flex justify-between items-center">
          <h1>WorkEase - Login</h1>
          <Link href="/" className={buttonVariants({ variant: "link" })}>
            Home
          </Link>
        </header> */}

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
          <Button className="w-full my-3" onClick={handleSignIn}>
            Sign in
          </Button>
        </Formfield>
      </div>

      {/* <Button onClick={handleSignIn}>Sign in</Button> */}
      {/* <button onClick={handleSignOut}>Sign out</button> */}
    </>
  );
}
