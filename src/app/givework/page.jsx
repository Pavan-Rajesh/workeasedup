/**
 *  here for getting location manually we have to modify the given code
 *
 *
 *
 */
"use client";
import React from "react";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/components/Navbar";

const Page = () => {
  const [name, setName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [workType, setWorkType] = useState(null);
  const [scplace, setscplace] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberofworkers, setNumberOfWorkers] = useState(null);
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [pincode, setPincode] = useState(null);
  function manualLocation() {
    const url = `https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/${pincode}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "fedf128934mshd6ab3a8a5eada3dp14371cjsn6e9685134704",
        "X-RapidAPI-Host":
          "india-pincode-with-latitude-and-longitude.p.rapidapi.com",
      },
    };

    try {
      const response = fetch(url, options)
        .then((res) => res)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          /**
           * // console.log(res[0].lat, res[0].lng);
           * console.log(res);
           * it shows array of values with objects and it contains each individual location of the pincode and we will be selecting the one of the coordinates
           *  */
          console.log(res);
          const [{ lat, lng }] = res;
          setscplace({ latitude: lat, longitude: lng });
        });
    } catch (error) {
      console.error(error);
    }
  }

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
      numberofworkers,
      workType,
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

  useEffect(() => {
    async function hello() {
      const { data, error } = await supabase.auth.getSession();
      setUser(data.session.user.email);
    }
    hello();
  }, []);

  return (
    <>
      <Navbar />
      <h1>welcome{user}</h1>
      <h5>
        here auto completion of the name and the phone number should be given
        that will be retrived from the sesssion
      </h5>
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
          <label>Number of workers</label>
          <input
            type="number"
            onChange={(e) => {
              setNumberOfWorkers(e.target.value);
            }}
          />
          <label>worktype</label>
          <input
            type="text"
            onChange={(e) => {
              setWorkType(e.target.value);
            }}
          />
          <label>pincode</label>
          <input
            type="text"
            name="pincode"
            onChange={(e) => setPincode(e.target.value)}
          />
          <button type="button" onClick={manualLocation}>
            get location manually
          </button>
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
