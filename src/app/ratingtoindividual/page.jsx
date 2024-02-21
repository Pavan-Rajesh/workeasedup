"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
const Page = () => {
  const [workers, setWorkers] = useState(["he"]);
  useEffect(() => {
    async function getIds() {
      fetch("/api/individualworkers")
        .then((data) => data.json())
        .then((data) => {
          console.log(data);
          setWorkers(data.workers[0].workers);
        });
    }
    getIds();
  }, []);
  return (
    <div>
      {workers.map((workerid) => (
        <Link href={`/giveratingworker/${workerid}`} key={workerid}>
          {workerid}khkjh
        </Link>
      ))}
    </div>
  );
};

export default Page;
