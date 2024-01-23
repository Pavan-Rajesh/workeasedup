"use client";
import React from "react";

import { useState } from "react";

const Page = () => {
  const [name, setName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [scplace, setscplace] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [noofdays, setNumberofDays] = useState(null); // this to be done and modified at the database also
  function getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      // update the value of userlocation variable
      setscplace({ latitude, longitude });
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name: name,
      phoneNumber: phoneNumber,
      coords: scplace,
      startDate: startDate,
      endDate: endDate,
    };
    console.log(JSON.stringify(data));
    fetch("/api/givework", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  return (
    <>
      <div className="max-w-md border-zinc-950 border-2 rounded-sm py-2 px-4">
        <h1>
          in this we will be giving work to others that means owner will be
          registering the work
        </h1>
        <form onSubmit={handleSubmit}>
          <label>name</label>
          <input
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <label>phonenumber </label>
          <input
            type="text"
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
          />
          <label>startdate</label>
          <input
            type="date"
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
          />
          <label>enddate</label>
          <input
            type="date"
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
          />

          <button type="submit">submit</button>
        </form>
        <button type="button" onClick={getUserLocation}>
          getLocation
        </button>
      </div>
    </>
  );
};

export default Page;
