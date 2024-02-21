"use client";
import Navbar from "@/components/Navbar";

import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import Fromfield from "@/components/Formfield";
const Page = () => {
  const [data, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [worker, setWorker] = useState([
    { workername: "xxxx", phonenumber: "xxxxxx" },
  ]);
  function searchWorker() {
    // here debouncing and throttling must be used to optimised
    setLoading(true);

    fetch(`/api/findworker?id=${data}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setWorker(data.data);
        setLoading(false);
      });
  }
  function addWorkertohead() {
    fetch("/api/addworkerhead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workerid: data,
      }),
    });
  }
  function removeWorker() {
    fetch("/api/deleteworkerhead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workerid: data,
      }),
    });
  }

  return (
    <>
      {/* <Navbar /> */}

      {/* <div>{loading ? <>loading</> : <></>}</div> */}
      <div className="flex justify-center contents-center flex-col w-full px-5 py-2  md:w-2/4">
        <Fromfield className="">
          <Label>Worker Id</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              className="placeholder-slate-800 placeholder-opacity-50"
              onChange={(e) => setId(e.target.value)}
              placeholder="deb387bb-98c8-4f98-8c72-1c8cf1533de1"
            />
            <Button
              type="button"
              onClick={searchWorker}
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
        <div className="flex justify-end gap-5">
          <Fromfield className="basis-2/5">
            <Button type="button" className="w-full" onClick={addWorkertohead}>
              Add worker
            </Button>
          </Fromfield>
          <Fromfield className="basis-2/5">
            <Button
              type="button"
              onClick={removeWorker}
              className={buttonVariants({
                variant: "destructive",
                className: "w-full",
              })}
            >
              Remove worker
              {/* here the woker should be removed */}
            </Button>
          </Fromfield>
        </div>

        <div className="my-5 h-max border-primary border p-5 rounded-xl w-full">
          <div>
            <span>Worker Name :</span>
            <span> {worker[0]?.workername} </span>
          </div>
          <div>
            <span>Worker PhoneNumber :</span>
            <span> {worker[0]?.phonenumber}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
