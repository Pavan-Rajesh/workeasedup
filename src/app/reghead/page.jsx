"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Fromfield from "@/components/Formfield";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import validator from "validator";

const Page = () => {
  const [name, setName] = useState(null);
  const [worktype, setWorktype] = useState(null);
  const [scplace, setscplace] = useState(null);
  const [pincode, setPincode] = useState(null);
  function getUserLocation() {
    const loading = toast.loading("fetching you location");
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      /**
       * update the value of userlocation variable
       * */
      setscplace({ latitude, longitude });
      toast.dismiss(loading);
      toast.success("successfully fetched you location");
    });
  }
  async function manualLocation() {
    if (!pincode || !validator.isLength(pincode, { min: 6, max: 6 })) {
      toast.error("enter valid pincode");
      return;
    }
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
      const loading = toast.loading("fetching you location");

      await fetch(url, options)
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
          console.log(res);
          setscplace({ latitude: lat, longitude: lng });
        });
      toast.dismiss(loading);
      toast.success("successfully fetched you location");
    } catch (error) {
      console.error(error);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !worktype || !scplace) {
      toast.error("fields shouldnt be empty");
      return;
    }
    const loading = toast.loading("processing");

    e.preventDefault();
    const data = {
      headname: name,
      worktype,
      scplace,
    };
    await fetch("/api/reghead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    toast.dismiss(loading);
    toast.success("successfully registered");
  }
  return (
    <>
      <div className="flex justify-center contents-center flex-col w-full px-5 py-2  md:w-2/4">
        <form onSubmit={handleSubmit}>
          <Fromfield>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
            />
          </Fromfield>
          <Fromfield>
            <Label>WorkType</Label>
            <Input
              type="text"
              name="worktype"
              onChange={(e) => setWorktype(e.target.value)}
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
            <Button type="submit">submit as a head</Button>
          </Fromfield>
        </form>
      </div>
    </>
  );
};

export default Page;
