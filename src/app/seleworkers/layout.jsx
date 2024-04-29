import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";

const layout = ({ children }) => {
  return (
    <MaxWidthWrapper className="flex justify-center items-center">
      {children}
    </MaxWidthWrapper>
  );
};

export default layout;
