"use client";
import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
const Page = () => {
  const [owner, setOwner] = useState({
    assigned: "false",
    ownerdata: [],
  });
  const [matched, setMatched] = useState(false);

  const [status, setAccept] = useState(true);
  function acceptOwner() {
    fetch("/api/workerstatus", {
      method: "POST",
      body: JSON.stringify({
        ownerid: owner.id,
        status,
      }),
    });
  }
  function rejectOwner() {
    fetch("/api/workerstatus", {
      method: "POST",
      body: JSON.stringify({
        ownerid: owner.id,
        status: false,
      }),
    });
  }

  useEffect(() => {
    async function hello() {
      fetch("/api/workerstatus")
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.owner.assigned) {
            setMatched(true);
            setOwner(res.owner.ownerData[0]);
          } else {
            setMatched(false);
          }
        });
    }
    hello();
  });
  return (
    <>
      {matched ? (
        <div className="flex flex-col w-full shadow-sm px-6 md:w-2/4 [&>*]:mt-5 border-2 border-primary rounded-lg">
          <div className="flex justify-start  gap-5">
            <div
              style={{
                width: "150px",
                height: "150px",
                backgroundColor: "lightblue",
              }}
            ></div>
            <div className="[&>*]:my-5">
              <div>
                <span className="font-bold">User Name :</span>
                <span> {owner.name}</span>
              </div>
              <div>
                <span className="font-bold">Aadhar :</span>
                <span> {owner.aadhar}</span>
              </div>
              <div>
                <span className="font-bold">Phone :</span>
                <span> {owner.phone}</span>
              </div>
            </div>
          </div>
          <div className="w-full flex [&>*]:basis-5/12 pb-5 justify-between">
            <Button type="button" onClick={acceptOwner}>
              {/* accept {id} */}
              Accept Owner
            </Button>
            <Button
              type="button"
              onClick={rejectOwner}
              className={buttonVariants({ variant: "destructive" })}
            >
              {/* reject {id} */}
              Reject Owner
            </Button>
          </div>
        </div>
      ) : (
        <h1>You dont have any owner assigned Please come Later</h1>
      )}
    </>
  );
};

export default Page;
