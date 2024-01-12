"use client";
import React from "react";
import Image from "next/image";
import { PAGE_NOT_FOUND } from "../../message";
import Loading from "../image/loading.jpeg";
import Plugs from "../image/Error.png";

const NotFound = (props) => {
  let getPropsLength = Object.keys(props).length;
  return (
    <div className="container-fluid flex flex-col items-center p-4 bg-gradient-to-b from-[#1D2E3E] h-[92.83vh]">
      <div className="flex items-center justify-center mt-20">
        <Image src={Plugs} alt="/" />
      </div>
      <div className="z-1 mb-4 text-[#ffff] text-center font-bold text-4xl">
        {getPropsLength == 0 ? PAGE_NOT_FOUND : props.message}
      </div>
      <div className="flex items-center justify-center">
        <Image
          src={Loading}
          alt="Loading"
          className="h-[2vh] mx-auto rounded-md"
        />
      </div>
    </div>
  );
};

export default NotFound;
