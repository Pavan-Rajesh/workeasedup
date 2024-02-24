"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const Page = ({ params }) => {
  const [rating, setRating] = useState(0);
  const [workerid, setWorkerId] = useState(params.workerid);
  const [data, setData] = useState({
    name: "xxxxxxx",
    aadhar: "xxxxxxx",
    phone: "xxxxxx",
  });

  useEffect(() => {
    fetch("/api/fetchuser", {
      method: "POST",
      body: JSON.stringify({
        headid: workerid, // here should be modified to worker id due to backend problem
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.headData[0]);
        setData(data.headData[0]);
      });
  }, []);
  async function submitRating() {
    const loading = toast.loading("processing");
    const x = await fetch("/api/individualworkers", {
      method: "POST",
      body: JSON.stringify({
        rating,
        workerid,
      }),
    });
    toast.dismiss(loading);
    toast.success("Rating successfully given");
  }

  return (
    <>
      {/* <div>
        {params.headid}
        <input
          type="number"
          name="ratingworker"
          onChange={(e) => setRating(e.target.value)}
        />
        <button type="button" onClick={submitRating}>
          giverating
        </button>
      </div> */}
      <div className="flex flex-col w-full px-6 md:w-2/4 [&>*]:mt-5 border border-primary rounded-lg">
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
              <span> {data.name}</span>
            </div>
            <div>
              <span className="font-bold">Aadhar :</span>
              <span> {data.aadhar}</span>
            </div>
            <div>
              <span className="font-bold">Phone :</span>
              <span> {data.phone}</span>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Input
            type="number"
            name="ratinghead"
            onChange={(e) => setRating(e.target.value)}
          />
          <Button
            type="button"
            className="my-5 ml-auto block"
            onClick={submitRating}
          >
            giverating
          </Button>
        </div>
      </div>
    </>
  );
};

export default Page;
