// registering for work
"use client";
import React from "react";

import { useState, useEffect } from "react";

// const Page = () => {
//   const [session, setSesssion] = useState(null);
//   const supabase = createClientComponentClient();
//   useEffect(() => {
//     async function getSession() {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();
//       setSesssion(session);
//       console.log(session);
//     }
//     getSession();
//   }, []);

//   return <>{session?.user?.id}</>;
// };

const Page = () => {
  const [name, setName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [scplace, setscplace] = useState(null);
  function getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      /**
       * update the value of userlocation variable
       * */
      setscplace({ latitude, longitude });
    });
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
        getLocation
      </button>
    </>
  );
};

export default Page;
