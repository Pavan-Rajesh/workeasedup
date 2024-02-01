// registering for work
"use client";
import React from "react";

import { useState, useEffect } from "react";

const Page = () => {
  const [name, setName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [scplace, setscplace] = useState(null);
  const [pincode, setPincode] = useState(null);
  function getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      /**
       * update the value of userlocation variable
       * */
      setscplace({ latitude, longitude });
    });
  }
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
          const [{ lat, lng }] = res;
          setscplace({ latitude: lat, longitude: lng });
        });
    } catch (error) {
      console.error(error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name: name,
      phoneNumber: phoneNumber,
      coords: scplace,
    };
    console.log(JSON.stringify(data));
    fetch("/api/registerwork", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>name</label>
        <input
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <label>phone number</label>
        <input
          type="text"
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
        />

        <button type="submit">submit</button>
      </form>
      <button type="button" onClick={getUserLocation}>
        getLocation at present place
      </button>

      <input type="text" onChange={(e) => setPincode(e.target.value)} />
      <button type="button" onClick={manualLocation}>
        manually enter location
      </button>
    </>
  );
};

export default Page;
