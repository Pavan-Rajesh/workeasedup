import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";
import Navbar from "@/components/Navbar";
const layout = ({ children }) => {
  return (
    <MaxWidthWrapper className="flex flex-col justify-center h-screen items-center">
      {children}
    </MaxWidthWrapper>
  );
};

export default layout;
