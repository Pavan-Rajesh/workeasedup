"use client";
import React from "react";
import { toast } from "sonner";
import { Axe } from "lucide-react";
const page = () => {
  return (
    <div>
      <button
        className="text-green-500"
        onClick={() => toast.success("My first toast", {})}
      >
        Give me a toast
      </button>
    </div>
  );
};

export default page;
