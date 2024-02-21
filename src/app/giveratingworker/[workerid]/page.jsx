"use client";
import React, { useState } from "react";

const Page = ({ params }) => {
  const [rating, setRating] = useState(0);
  const [workerid, setWorkerid] = useState(params.workerid);
  function submitRating() {
    fetch("/api/individualworkers", {
      method: "POST",
      body: JSON.stringify({
        rating,
        workerid,
      }),
    });
  }

  return (
    <div>
      {params.headid}
      <input
        type="number"
        name="ratingworker"
        onChange={(e) => setRating(e.target.value)}
      />
      <button type="button" onClick={submitRating}>
        giverating
      </button>
    </div>
  );
};

export default Page;
