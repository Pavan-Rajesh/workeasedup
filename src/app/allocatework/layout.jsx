import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const layout = ({ children }) => {
  return (
    <MaxWidthWrapper className="flex flex-col justify-center items-center">
      {/* <Navbar /> */}
      {children}
    </MaxWidthWrapper>
  );
};

export default layout;
