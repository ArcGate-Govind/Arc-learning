"use client";
import React, { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";

const AOSWrapper = ({ children }) => {
  useEffect(() => {
    AOS.init({});
  }, []);

  return <div>{children}</div>;
};

export default AOSWrapper;
