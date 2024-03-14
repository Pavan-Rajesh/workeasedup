"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./map.module.css";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default function Page() {
  const [data, setData] = useState(null);
  const MapWithNoSSR = dynamic(() => import("@/components/map"), {
    ssr: false,
  });
  useEffect(() => {
    fetch("/api/mapdetails", { method: "GET" })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setData(res);
      });
  }, []);

  return (
    <main className="h-full w-full flex flex-col lg:flex-row  [&>*]:basis-1/2 -z-30">
      <div id="map" className="">
        <MapWithNoSSR />
      </div>
      <div className="border border-primary flex justify-center items-center">
        <div>
          <Link
            href="/"
            className={buttonVariants({ variant: "link", className: "block" })}
          >
            Go to Home
          </Link>
        </div>
        <div className="p-5 m-5">
          <span className="font-bold text-lg">
            {" "}
            Owners Count: {data?.ownersCount}
          </span>
          <br></br>
          <span className="font-bold text-lg">
            head Count: {data?.workerCount}
          </span>{" "}
          <br></br>
          <span className="font-bold text-lg">
            workers Count: {data?.headCount}
          </span>
          <br></br>
        </div>
      </div>
    </main>
  );
}
