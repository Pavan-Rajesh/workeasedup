/**
 * Here in the ownerdash board we will be showing the workers and a button to their profile so when the owner clicks the    * button you will be directed to another page and then owner will be giving rating to the worker then from the owner table
 * the workers uuid will be deleted and status of the worker will be updated that is isworking to true or false
 *
 *
 */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const [workersDetails, setWorkersDetails] = useState([]);

  useEffect(() => {
    async function fetchWorkersworked() {
      fetch("/api/ownerdash")
        .then((data) => data.json())
        .then((data) => {
          /**
           *  here we will be selecting data.workers because we will be sending with some data from backend 
           *  return NextResponse.json({
           *    workers: workersDetails,
           *     message: "This Worked",
           *     success: true,
  });
           * 
           */
          setWorkersDetails(data.workers);
          console.log(data.workers);
        });
    }
    fetchWorkersworked();
  }, []);

  return (
    <div>
      {workersDetails.map((workCompletedWorker) => {
        return (
          <div key={workCompletedWorker.userid}>
            {workCompletedWorker.userid}
            {workCompletedWorker.workername}
            <Link href={`/giverating/${workCompletedWorker.userid}`}>
              {workCompletedWorker.workername}
            </Link>
          </div>
        );
      })}
      hello
    </div>
  );
};

export default Page;
