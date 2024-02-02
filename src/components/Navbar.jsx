"use client";
import React from "react";
import Link from "next/link";
const Navbar = () => {
  return (
    <>
      <nav>
        <div>Work Ease</div>
        <div>
          <div>
            <Link href={"/register"}>Register</Link>
          </div>
          <Link href={"/register"}>Login</Link>
          <Link href={"/action"}>Action</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
