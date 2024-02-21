// registering for work
"use client";
import Navbar from "@/components/Navbar";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Fromfield from "@/components/Formfield";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Page = () => {
  const [name, setName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [scplace, setscplace] = useState(null);
  const [pincode, setPincode] = useState(null);
  const [typeofwork, setTypeOfwork] = useState(null);
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
      typeofwork,
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
      {/* <Navbar /> */}
      <div className="flex justify-center contents-center flex-col w-full px-5 py-2  md:w-2/4">
        <form onSubmit={handleSubmit}>
          <Fromfield>
            <Label>name</Label>
            <Input
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Fromfield>
          <Fromfield>
            <Label>phone number</Label>
            <Input
              type="text"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </Fromfield>
          <Fromfield>
            <Label>type of work</Label>
            <Input
              type="text"
              onChange={(e) => {
                setTypeOfwork(e.target.value);
              }}
            />
          </Fromfield>
          <Dialog className="w-2/4 ">
            <DialogTrigger asChild>
              <Button variant="outline">Get Location</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="text-left">
                <DialogTitle>Set you Current Location</DialogTitle>
                <DialogDescription>
                  Enter Your pincode or Get your Location
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 ">
                <div className="grid grid-cols-4 items-center content-center  gap-4">
                  <Label className="text-right  m-0">Pincode</Label>
                  <Input
                    type="text"
                    name="pincode"
                    className="col-span-3"
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-row content-center justify-evenly">
                <Button
                  type="Button"
                  className={buttonVariants({
                    className: "basis-2/5",
                  })}
                  onClick={getUserLocation}
                >
                  GetCurrentLocation
                </Button>
                <Button
                  type="Button"
                  onClick={manualLocation}
                  className={buttonVariants({
                    className: "basis-2/5",
                  })}
                >
                  Get Location Manually
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Fromfield>
            <Button type="submit">submit</Button>
          </Fromfield>
        </form>
        {/* <Button type="button" onClick={getUserLocation}>
        getLocation at present place
      </Button>

      <Input type="text" onChange={(e) => setPincode(e.target.value)} />
      <Button type="button" onClick={manualLocation}>
        manually enter location
      </Button> */}
      </div>
    </>
  );
};

export default Page;
