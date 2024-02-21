"use client";
import React from "react";
import Link from "next/link";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button, buttonVariants } from "./ui/button";
import { Youtube, Facebook } from "lucide-react";
const Footer = () => {
  return (
    <footer className="border-t-2 border-primary grid md:grid-cols-3 my-5">
      <div className="items-start my-4">
        <Label htmlFor="email" className="w-max font-semibold">
          Subscribe for a Newsletter :
        </Label>

        <Input type="email" placeholder="Email" className="my-3 w-10/12" />
        <Button
          className={buttonVariants({ variant: "secondary", size: "sm" })}
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
          Written by <a href="mailto:webmaster@example.com">Jon Doe</a>.<br />
          Visit us at:
          <br />
          Example.com
          <br />
          Box 564, Disneyland
          <br />
          USA
        </p>
      </div>
    </footer>
  );
};

export default Footer;
