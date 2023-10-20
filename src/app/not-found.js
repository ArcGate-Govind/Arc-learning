"use client";
import React from "react";
import { PAGE_NOT_FOUND } from "../../message";
const NotFound = (props) => {
  let getPropsLenth = Object.keys(props).length;
  return (
    <>
      {/* <div className="not-found_back-ground absolute inset-0"></div> */}
      <div className="z-1">
        {getPropsLenth == 0 ? PAGE_NOT_FOUND : props.message}
      </div>
    </>
  );
};

export default NotFound;
