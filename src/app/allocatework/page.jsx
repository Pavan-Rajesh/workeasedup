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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Fromfield from "@/components/Formfield";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import validator from "validator";

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
    if (
      !pincode ||
      !validator.isLength(pincode, { min: 5, max: 6 }) ||
      !validator.isNumeric(pincode)
    ) {
      toast.error("enter valid pincode");
      return;
    }
    const loading = toast.loading("fetching your location");
    const url = ``;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "",
        "X-RapidAPI-Host":
          "",
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
          toast.success("successfully fetched your location");
          toast.dismiss(loading);
        });
    } catch (error) {
      console.error(error);
    }
  }

  function getUserLocation() {
    const loading = toast.loading("fetching your location");
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      // update the value of userlocation variable
      setscplace({ latitude, longitude });
      toast.success("successfully fetched your location");
      toast.dismiss(loading);
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !startDate ||
      !endDate ||
      !name ||
      !workType ||
      !numberofworkers ||
      !phoneNumber ||
      !scplace
    ) {
      toast.error("fields should be empty");
      return;
    }

    if (
      !validator.isLength(phoneNumber, { min: 10, max: 10 }) ||
      !validator.isNumeric(phoneNumber)
    ) {
      toast.error("enter valid mobile number");
      return;
    }
    if (!validator.isNumeric(numberofworkers)) {
      toast.error("enter valid aadhar number");
      return;
    }

    const loading = toast.loading("allocating the work");

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
    // console.log(data);
    // console.log(JSON.stringify(data));
    await fetch("/api/givework", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    toast.dismiss(loading);
    toast.success("successfully allocated work");

    router.push("/");
  }
  const router = useRouter();

  useEffect(() => {
    async function hello() {
      const { data, error } = await supabase.auth.getSession();
      setUser(data.session.user.email);
    }
    hello();
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      {/* <h1>welcome{user}</h1>
      <h5>
        here auto completion of the name and the phone number should be given
        that will be retrived from the sesssion
      </h5>
      <h1>
        in this we will be giving work to others that means owner will be
        registering the work
      </h1> */}
      <div className="flex justify-center contents-center flex-col w-full px-5 py-2  md:w-2/4">
        <form onSubmit={handleSubmit}>
          <Fromfield>
            <Label>Name</Label>
            <Input
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Fromfield>
          <Fromfield>
            <Label>PhoneNumber </Label>
            <Input
              type="text"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </Fromfield>
          <Fromfield>
            <Label>StartDate</Label>
            <Input
              type="date"
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              style={{}}
            />
          </Fromfield>
          <Fromfield>
            <Label>EndDate</Label>
            <Input
              type="date"
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            />
          </Fromfield>
          <Fromfield>
            <Label>Number of workers</Label>
            <Input
              type="number"
              onChange={(e) => {
                setNumberOfWorkers(e.target.value);
              }}
            />
          </Fromfield>
          <Fromfield>
            <Label>WorkType</Label>
            <Input
              type="text"
              onChange={(e) => {
                setWorkType(e.target.value);
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
          {/* <Fromfield>
            <Label>Pincode</Label>
            <Input
              type="text"
              name="pincode"
              onChange={(e) => setPincode(e.target.value)}
            />
          </Fromfield>
          <Fromfield className="flex justify-between ">
            <Button
              type="Button"
              onClick={manualLocation}
              className={buttonVariants({
                variant: "outline",
                className: "basis-2/5",
              })}
            >
              Get Location Manually
            </Button>
            <Button
              type="Button"
              className={buttonVariants({
                variant: "outline",
                className: "basis-2/5",
              })}
              onClick={getUserLocation}
            >
              GetCurrentLocation
            </Button>
          </Fromfield> */}

          <Button type="submit" className="w-full mt-4">
            submit
          </Button>
        </form>
      </div>
    </>
  );
};

export default Page;
