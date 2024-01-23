"use client";
import React, { useState } from "react";

const Page = () => {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      headname: name,
    };
    fetch("/api/reghead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  return (
    <>
      <div>register as a head</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">submit as a head</button>
      </form>
    </>
  );
};

export default Page;
