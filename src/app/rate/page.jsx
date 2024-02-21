"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
const Page = () => {
  const mine = useSearchParams();
  const [rating, setRating] = useState(null);
  function submitNormalWorkerRating(e) {
    fetch("/api/normalworkerrate", {
      method: "POST",
      body: JSON.stringify({
        workerid: mine.get("normalworkerid"),
        rating,
      }),
    });
  }
  function submitHeadWorkersRating() {
    fetch("/api/headworkerrate", {
      method: "POST",
      body: JSON.stringify({
        workerid: mine.get("headworkersid"),
        rating,
      }),
    });
  }
  function submitHeadRating() {
    fetch("/api/headrate", {
      method: "POST",
      body: JSON.stringify({
        workerid: mine.get("headid"),
        rating,
      }),
    });
  }
  return (
    <>
      <input
        type="text"
        name="rating"
        onChange={(e) => {
          setRating(e.target.value);
        }}
      />

      <div>
        {mine.has("normalworkerid") ? (
          <>
            {
              <button type="button" onClick={submitNormalWorkerRating}>
                submitnormalworkerid
              </button>
            }
          </>
        ) : (
          <>{}</>
        )}
      </div>
      <div>
        {mine.has("headworkersid") ? (
          <>
            {
              <button type="button" onClick={submitHeadWorkersRating}>
                headworkersid
              </button>
            }
          </>
        ) : (
          <>{}</>
        )}
      </div>
      <div>
        {mine.has("headid") ? (
          <>
            {
              <button type="button" onClick={submitHeadRating}>
                headid
              </button>
            }
          </>
        ) : (
          <>{}</>
        )}
      </div>
    </>
  );
};
export default Page;
{
  /* 

.foreach((x) => {
        <button
          type="button"
          onClick={() => {
            console.log(`${x}/${mine.get(x)}/`);
          }}
        >
          hello
        </button>;
      })} */
}
