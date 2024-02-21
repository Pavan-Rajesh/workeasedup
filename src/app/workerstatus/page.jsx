"use client";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [id, setId] = useState(0);
  const [status, setAccept] = useState(true);
  function acceptOwner() {
    fetch("/api/workerstatus", {
      method: "POST",
      body: JSON.stringify({
        ownerid: id,
        status,
      }),
    });
  }
  function rejectOwner() {
    fetch("/api/workerstatus", {
      method: "POST",
      body: JSON.stringify({
        ownerid: id,
        status: false,
      }),
    });
  }

  useEffect(() => {
    async function hello() {
      fetch("/api/workerstatus")
        .then((res) => res.json())
        .then((res) => {
          console.log(res.ownerData[0].id);
          setId(res.ownerData[0].id);
        });
    }
    hello();
  });
  return (
    <div>
      page
      <button type="button" onClick={acceptOwner}>
        accept {id}
      </button>
      <button type="button" onClick={rejectOwner}>
        reject {id}
      </button>
    </div>
  );
};

export default Page;
