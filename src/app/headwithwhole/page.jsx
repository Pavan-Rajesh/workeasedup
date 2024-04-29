"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardDescription,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { ta } from "date-fns/locale";
const Page = () => {
  const [rating, setRating] = useState(null);
  const [heads, setHeads] = useState([]);
  useEffect(() => {
    async function fetchheads() {
      const loading = toast.loading("fetching");
      await fetch("/api/headwithwhole", {
        method: "GET",
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res);
          setHeads(res.headsData);
        });
      toast.dismiss(loading);
      toast.success("successfully fetched");
    }
    fetchheads();
  }, []);

  return (
    <div className="grid gap-8 grid-cols-1 w-full pt-10">
      {heads.map((head) => {
        return (
          // <Link href={`/individualhead/${head}`} key={head}>
          //   {head}
          // </Link>
          // {"name":"headtwo","phone":"324534534","aadhar":"3432543","id":"9b5f6061-c812-4b92-9a2e-8730c82a41cb"}

          <Link href={`/individualhead/${head.id}`} key={head.id}>
            <Card className="relative w-full">
              <CardHeader>
                <CardTitle>
                  Name: {head.name}
                  <Link
                    href={`/individualhead/${head.id}`}
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
                  <span className="font-bold">Aaadhar :</span> {head.aadhar}
                </div>

                <div>
                  <span className="font-bold">PhoneNumber :</span>
                  {head.phone}
                </div>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default Page;
