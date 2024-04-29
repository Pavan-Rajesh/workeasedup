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
  const [role, setRole] = useState("worker");
  const [roleData, setRoleData] = useState(null);
  const [headIds, setHeadIds] = useState(null);
  const [workerIds, setWorkerIds] = useState(null);

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
        // const { workerdata } = res;
        if (role == "head") {
          setRoleData(res.headData[0]);
          setWorkerIds(res.workerIds[0].workers);
          console.log(res.headData[0]);
        }
        if (role == "worker") {
          setRoleData(res.workerdata[0]);
        } else if (role == "owner") {
          console.log(res);
          setRoleData(res.ownerdata[0]);
          setHeadIds(res.headIds[0].head);

          setWorkerIds(res.workerIds[0].workers);
        }
      });
    toast.dismiss(loading);
    toast.success("successfully fetched your details");
  }

  return (
    <div className="w-full border-2 border-primary pt-5 rounded-md">
      <div className="container flex gap-1 ">
        <div
          style={{
            width: "150px",
            height: "150px",
            backgroundColor: "hotpink",
          }}
          className="rounded-sm opacity-10"
        ></div>

        <div className="flex flex-col rounded-sm justify-center px-5 flex-grow">
          {role == "worker" ? (
            <>
              <div>
                <span>Name : {roleData?.workername}</span>
              </div>
              <div>
                <span>Worktype : {roleData?.worktype}</span>
              </div>
              <div>
                <span>Head : {roleData?.head}</span>
              </div>
              <div>
                <span>Owner : {roleData?.owner}</span>
              </div>
              <div>
                <span>
                  Status : {roleData?.status ? roleData.status : "Not assigned"}
                </span>
              </div>
            </>
          ) : (
            <></>
          )}

          {role == "owner" ? (
            <>
              <div>
                <span>Name : {roleData?.ownername}</span>
              </div>
              <div>
                <span>worktype : {roleData?.worktype}</span>
              </div>
              <div>
                <span>
                  Number of workers Required : {roleData?.noworkersreq}
                </span>
              </div>
              <div>
                <span>accepted : {roleData?.accepted}</span>
              </div>
              <div>
                <span>pending:{roleData?.pending}</span>
              </div>
              <div>
                <span>HeadIds:{headIds?.map((id) => id)}</span>
              </div>
              <div>
                <span>WorkerIds:{workerIds?.map((id) => id)}</span>
              </div>
            </>
          ) : (
            <></>
          )}
          {role == "head" ? (
            <>
              <div>
                <span>Name : {roleData?.name}</span>
              </div>
              <div>
                <span>worktype : {roleData?.worktype}</span>
              </div>
              <div>
                <span>No of workers : {roleData?.noofworkers}</span>
              </div>
              <div>
                <span>status : {roleData?.status}</span>
              </div>
              <div>
                <span>owner : {roleData?.owner}</span>
              </div>

              <div>
                <span>
                  WorkerIds:
                  {workerIds?.map((id) => (
                    <div key={id}>{id}</div>
                  ))}
                </span>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="flex [&>*]:m-5 justify-center ">
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
      </div>

      {/* {JSON.stringify(roleData)} */}
    </div>
  );
};

export default Page;
