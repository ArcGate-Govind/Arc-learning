"use client";
import React, { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";

// AOSWrapper is a React component that initializes AOS on mount and wraps its children
const AOSWrapper = ({ children }) => {
  // initializing AOS
  useEffect(() => {
    AOS.init({});
  }, []);

  // Render the component with the AOS-initialized wrapper
  return <div>{children}</div>;
};

export default AOSWrapper;
