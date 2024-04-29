"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button, buttonVariants } from "./ui/button";
import { Youtube, Facebook } from "lucide-react";
import { toast } from "sonner";
const Footer = () => {
  const [email, setEmail] = useState("");
  async function subscribe() {
    const loading = toast.loading("adding to the list");
    await fetch("/api/mailchimp", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.subscribe) {
          toast.dismiss(loading);
          toast.success("successfully added to the list");
        } else if (res.error) {
          toast.dismiss(loading);
          toast.error("something wrong happend");
        }
      });
  }
  return (
    <footer className="border-t-2 border-primary grid md:grid-cols-3 my-5">
      <div className="items-start my-4">
        <Label htmlFor="email" className="w-max font-semibold">
          Subscribe for a Newsletter :
        </Label>

        <Input
          type="email"
          placeholder="Email"
          className="my-3 w-10/12"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Button
          className={buttonVariants({ variant: "secondary", size: "sm" })}
          onClick={() => {
            subscribe();
          }}
        >
          Subscribe
        </Button>
      </div>
      <div className="[&>*]:mt-3 my-4">
        <span
          style={{
            textDecoration: "underline",
            textDecorationColor: "rgb(59,130,246)",
            textDecorationThickness: "2px",
          }}
          className="font-semibold"
        >
          Social Media
        </span>
        <Link
          href={"https://www.youtube.com/"}
          className="flex gap-2 items-center"
        >
          <Youtube color="red" />
          Youtube
        </Link>
        <Link
          href={"https://www.youtube.com/"}
          className="flex gap-2 items-center"
        >
          <Facebook color="blue" />
          <p>Facebook</p>
        </Link>
      </div>
      <div className="my-4 ">
        <span
          style={{
            textDecoration: "underline",
            textDecorationColor: "rgb(59,130,246)",
            textDecorationThickness: "2px",
          }}
          className="font-semibold"
        >
          Contact us
        </span>
        <p className="my-3">
          Product by<a href="mailto:webmaster@example.com"> WorkEase INC</a>.
          <br />
          Visit us at:
          <br />
          Inc@workease.com
          <br />
          RJY
          <br />
          India
        </p>
      </div>
    </footer>
  );
};

export default Footer;
