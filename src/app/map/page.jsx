import React from "react";
import dynamic from "next/dynamic";
import styles from "./map.module.css";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default function Page() {
  const MapWithNoSSR = dynamic(() => import("@/components/map"), {
    ssr: false,
  });

  return (
    <main className="h-full w-full flex flex-col lg:flex-row  [&>*]:basis-1/2">
      <div id="map" className="">
        <MapWithNoSSR />
      </div>
      <div className="border border-primary">
        mapdetails
        <Link href="/" className={buttonVariants({ variant: "link" })}>
          Go to Home
        </Link>
      </div>
    </main>
  );
}
