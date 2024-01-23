"use client";
import React, { useState } from "react";

const Page = () => {
  const [data, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [worker, setWorker] = useState(null);
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
   q
  }

  return (
    <>
      <div>{loading ? <>loading</> : <></>}</div>
      <br />
      <input type="text" onChange={(e) => setId(e.target.value)} />
      <br />
      <button type="button" onClick={searchWorker}>
        search the given worker
      </button>
      <br />
      <button type="button" onClick={addWorkertohead}>
        add worker under me
      </button>
      <br />
      <button type="button" onClick={removeWorker}>
        remove worker
        {/* here the woker should be removed */}
      </button>
    </>
  );
};

export default Page;
