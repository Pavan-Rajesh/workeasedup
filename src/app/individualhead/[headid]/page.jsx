"use client";
import React, { useState } from "react";

const Page = ({ params }) => {
  const [rating, setRating] = useState(0);
  const [headid, setHeadid] = useState(params.headid);
  function submitRating() {
    fetch("/api/individualhead", {
      method: "POST",
      body: JSON.stringify({
        rating,
        headid,
      }),
    });
  }

  return (
    <div>
      {params.headid}
      <input
        type="number"
        name="ratinghead"
        onChange={(e) => setRating(e.target.value)}
      />
      <button type="button" onClick={submitRating}>
        giverating
      </button>
    </div>
  );
};

export default Page;
