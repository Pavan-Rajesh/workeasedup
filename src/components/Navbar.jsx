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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState, useRef } from "react";

const Navbar = () => {
  // const navRef = useRef(null);
  const [email, setEmail] = useState("guest@gmail");
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setEmail(session?.user?.email);
    });

    // async function getUser() {
    //   const { data } = await supabase.auth.getUser();
    //   setEmail(data.user.email);
    // }
    // getUser();
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);
  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <nav className=" backdrop-blur flex justify-between content-center items-center h-16 border-b-2 border-primary ">
          <Link href="/">
            <div className="font-bold text-xl px-5">WorkEase</div>
          </Link>
          <div className="[&>*]:mx-1 px-5 [&>*]:font-medium [&>*]:m-0 flex justify-center items-center">
            <div className="font-light">{email}</div>
            <Sheet>
              <SheetTrigger
                className={buttonVariants({ variant: "secondary" })}
              >
                Menu
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Navigate to</SheetTitle>

                  <SheetDescription>
                    <div className="flex flex-col [&>*]:w-3/4 items-center gap-2 mt-6 ">
                      <Link
                        href={"/register/reg"}
                        className={buttonVariants({
                          variant: "link",
                          size: "lg",
                        })}
                      >
                        Register
                      </Link>

                      <Link
                        href={"/register/log"}
                        className={buttonVariants({
                          variant: "link",
                          size: "lg",
                        })}
                      >
                        Login
                      </Link>
                      <Link
                        href={"/action"}
                        className={buttonVariants({
                          variant: "link",
                          size: "lg",
                        })}
                      >
                        Action
                      </Link>
                      <Link
                        href={"/accountdash"}
                        className={buttonVariants({
                          variant: "link",
                          size: "lg",
                        })}
                      >
                        DashBoard
                      </Link>
                      <Link
                        href={"/headstatus"}
                        className={buttonVariants({
                          variant: "link",
                          size: "lg",
                        })}
                      >
                        Check Status (head)
                      </Link>
                      <Link
                        href={"/workerstatus"}
                        className={buttonVariants({
                          variant: "link",
                          size: "lg",
                        })}
                      >
                        Check Status (Worker)
                      </Link>
                      <Link
                        href={"/search"}
                        className={buttonVariants({
                          variant: "link",
                          size: "lg",
                        })}
                      >
                        Search
                      </Link>
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            {/* <DropdownMenu>
              <DropdownMenuTrigger>Open</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    href={"/register/reg"}
                    className={buttonVariants({
                      variant: "link",
                      size: "lg",
                    })}
                  >
                    Register
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={"/register/log"}
                    className={buttonVariants({
                      variant: "link",
                      size: "lg",
                    })}
                  >
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={"/action"}
                    className={buttonVariants({
                      variant: "link",
                      size: "lg",
                    })}
                  >
                    Action
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={"/accountdash"}
                    className={buttonVariants({
                      variant: "link",
                      size: "lg",
                    })}
                  >
                    DashBoard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={"/headstatus"}
                    className={buttonVariants({
                      variant: "link",
                      size: "lg",
                    })}
                  >
                    Check Status (head)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={"/workerstatus"}
                    className={buttonVariants({
                      variant: "link",
                      size: "lg",
                    })}
                  >
                    Check Status (Worker)
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            <div>
              <ThemeToggler />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
