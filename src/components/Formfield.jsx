import React from "react";
import { cn } from "@/lib/utils";
const Fromfield = ({ className, children }) => {
  return <div className={cn("my-2", className)}>{children}</div>;
};

export default Fromfield;
