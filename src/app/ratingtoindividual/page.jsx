"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardDescription,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
const Page = () => {
  const [workers, setWorkers] = useState([]);
  useEffect(() => {
    fetch("/api/individualworkers")
      .then((data) => data.json())
      .then((data) => {
        console.log(data.workers);
        setWorkers(data.workers);
      });
  }, []);
  return (
    <>
      <div className="grid gap-8 grid-cols-1 w-full pt-10">
        {workers.map((data) => (
          <Link href={`/giveratingworker/${data.id}`} key={data.id}>
            <Card className="relative w-full">
              <CardHeader>
                <CardTitle>
                  Name: {data.name}
                  <Link
                    href={`/giveratingworker/${data.id}`}
                    className={buttonVariants({
                      variant: "link",
                      className: "absolute bottom-5 right-8",
                    })}
                  >
                    Give Rating
                  </Link>
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <span className="font-bold">Aaadhar :</span> {data.aadhar}
                </div>

                <div>
                  <span className="font-bold">PhoneNumber :</span>
                  {data.phone}
                </div>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Page;
