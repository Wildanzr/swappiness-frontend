import React, { PropsWithChildren } from "react";
import HeaderLayout from "./header";

const WrapperLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-full p-5">
      <HeaderLayout />
      {children}
    </div>
  );
};

export default WrapperLayout;
