"use client";
import React from "react";
import Image from "next/image";
import { PAGE_NOT_FOUND } from "../../message";
import Loading from "../image/loading.jpeg";
import Plugs from "../image/Plugs.png";

const NotFound = (props) => {
  let getPropsLength = Object.keys(props).length;
  return (
    <div className="container-fluid mx-auto p-4 bg-[#1D2E3E] max-h-screen">
      <div className="z-1 text-[#ffff]">
        {getPropsLength == 0 ? PAGE_NOT_FOUND : props.message}
      </div>
      <div className="flex">
        <div className="w-screen flex items-center justify-center">
          <Image src={Loading} alt="Loading" className="mx-auto rounded-md" />
        </div>
        <div className="w-1/4">
          <Image src={Plugs} alt="/" className="transform rotate-90" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
