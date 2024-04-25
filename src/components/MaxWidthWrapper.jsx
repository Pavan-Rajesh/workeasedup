import React from "react";
import { cn } from "@/lib/utils";
const MaxWidthWrapper = ({ className, children }) => {
  return (
    <div
      className={cn("mx-auto w-full  min-h-[80vh] px-2.5 md:px-20 ", className)}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
//max-w-screen-xl
