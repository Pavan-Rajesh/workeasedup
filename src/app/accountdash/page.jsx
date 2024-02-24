"use client";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [role, setRole] = useState("");
  const [roleData, setRoleData] = useState(null);

  // to be done
  function Worker() {
    return (
      <>
        <div>
          role:{role}
          owner:{}
          worktype:{}
          status:{}
        </div>
      </>
    );
  }
  function Owner() {
    <div>
      role:{role}
      <div>workers</div>
      startdate:{}
      workers Required:{}
      <div>heads</div>
      accepted:{}
      pending:{}
      worktype:{}
      status:{}
    </div>;
  }

  function Head() {
    <div>
      <div>div</div>
      owner:{}
      workers:{}
      workersCount:{}
      status:{}
    </div>;
  }

  async function fetchDetails() {
    const loading = toast.loading("fetching your details");
    await fetch("/api/dashboard", {
      method: "POST",
      body: JSON.stringify({
        role,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setRoleData(res);
      });
    toast.dismiss(loading);
    toast.success("successfully fetched your details");
  }

  return (
    <div className="container">
      <div
        style={{ width: "150px", height: "150px", backgroundColor: "hotpink" }}
      ></div>
      <div>
        <div>
          <span>Name :</span>
          <span></span>
        </div>
        <div>
          <span>Aadhar :</span>
          <span></span>
        </div>
        <div>
          <span>Phone :</span>
          <span></span>
        </div>
      </div>
      <Select
        onValueChange={(data) => {
          setRole(data);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="owner">owner</SelectItem>
          <SelectItem value="worker">worker</SelectItem>
          <SelectItem value="head">head</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={() => {
          fetchDetails();
        }}
      >
        Fetch Details
      </Button>
      {role ? <></> : <h1>Select Role to fetch details</h1>}
      {JSON.stringify(roleData)}
    </div>
  );
};

export default Page;
