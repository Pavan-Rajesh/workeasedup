"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Formfield from "@/components/Formfield";
import validator from "validator";
import { WandSparkles } from "lucide-react";
import { toast } from "sonner";
export default function Login() {
  const [useremail, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const router = useRouter();
  const supabase = createClientComponentClient();
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        const newPassword = prompt(
          "What would you like your new password to be?"
        );
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (data) alert("Password updated successfully!");
        if (error) alert("There was an error updating your password.");
      }
    });
  }, []);

  const handleResetPass = async () => {
    if (!validator.isEmail(useremail)) {
      toast.error("enter valid email");
      return;
    }
    const loading = toast.loading("sending you link");

    const { data, error } = await supabase.auth.signInWithOtp({
      email: useremail,
      options: {
        emailRedirectTo: "http://localhost:3000/",
      },
    });

    if (error) {
      toast.dismiss(loading);
      toast.error("invalid credintials");
    } else {
      toast.dismiss(loading);
      toast.success("successfully sent Magic Link");
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
        <Formfield>
          <Label>Email</Label>
          <Input name="email" onChange={(e) => setEmail(e.target.value)} />
        </Formfield>

        <Formfield>
          <Button className="w-full my-3 text-white" onClick={handleResetPass}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-wand-sparkles"
            >
              <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
              <path d="m14 7 3 3" />
              <path d="M5 6v4" />
              <path d="M19 14v4" />
              <path d="M10 2v2" />
              <path d="M7 8H3" />
              <path d="M21 16h-4" />
              <path d="M11 3H9" />
            </svg>{" "}
            <span className="ml-3">Send Magic Link</span>
          </Button>
        </Formfield>
      </div>

      {/* <Button onClick={handleSignIn}>Sign in</Button> */}
      {/* <button onClick={handleSignOut}>Sign out</button> */}
    </>
  );
}
