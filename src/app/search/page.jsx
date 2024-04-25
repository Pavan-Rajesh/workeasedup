"use client";
import Navbar from "@/components/Navbar";

import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

import Fromfield from "@/components/Formfield";
const Page = () => {
  const [data, setId] = useState(null);
  const [user, setUser] = useState([
    { workername: "xxxx", phonenumber: "xxxxxx" },
  ]);
  async function search() {
    // here debouncing and throttling must be used to optimised

    const loading = toast.loading("fetching user");

    await fetch(`/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setUser(data);
      });
    toast.dismiss(loading);
    toast.success("data successfully fetched");
  }

  return (
    <>
      {/* <Navbar /> */}

      {/* <div>{loading ? <>loading</> : <></>}</div> */}
      <div className="flex justify-center contents-center flex-col w-full px-5 py-2  md:w-2/4">
        <Fromfield className="">
          <Label>Enter the Id</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              className="placeholder-slate-800 placeholder-opacity-50"
              onChange={(e) => setId(e.target.value)}
              placeholder="deb387bb-98c8-4f98-8c72-1c8cf1533de1"
            />
            <Button
              type="button"
              onClick={search}
              className={buttonVariants({
                variant: "ghost",
                className:
                  "bg-white border-primary border dark:bg-current dark:hover:bg-primary-foreground",
              })}
            >
              <Search strokeWidth={3} className="text-primary " />
            </Button>
          </div>
        </Fromfield>

        <div className="my-5 h-max border-primary border p-5 rounded-xl w-full">
          <div>
            <span> Name :</span>
            <span> {user?.name} </span>
          </div>
          <div>
            <span> PhoneNumber :</span>
            <span> {user?.phone}</span>
          </div>
          <div>
            <span> Aadhar :</span>
            <span> {user?.aadhar}</span>
          </div>
          <div>
            <span> Address :</span>
            <span> {user?.address}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
