/**
 * location should be specified in the navbar
 *
 *
 */
"use client";
import React from "react";
import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";
import { buttonVariants } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
const Navbar = () => {
  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <nav className=" backdrop-blur flex justify-between content-center items-center h-16 border-b-2 border-primary ">
          <Link href="/">
            <div className="font-bold text-xl px-5">WorkEase</div>
          </Link>
          <div className="[&>*]:mx-1 px-5 [&>*]:font-medium [&>*]:m-0 flex justify-center items-center">
            <Link
              href={"/register/reg"}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Register
            </Link>

            <Link
              href={"/register/log"}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Login
            </Link>
            <Link
              href={"/action"}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Action
            </Link>
            <ThemeToggler />
          </div>
          <Sheet>
            <SheetTrigger>Open</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
