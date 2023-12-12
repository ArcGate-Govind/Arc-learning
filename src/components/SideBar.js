"use client";
import { SidebarContext } from "@/context/sidebarContext";
import SideBarLayer from "./SideBarLayer";
import React, { useContext } from "react";

const SideBar = () => {
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  return (
    <div
      className={`${
        isOpen
          ? "bg-[#E3F2FD] md:bg-opacity-50 min-w-[25rem] md:min-w-[20rem] min-h-screen md:min-h-[55rem] transform translate-x-0 transition-all duration-700 ease-in-out"
          : "bg-[#FFFFFF] w-0 transform -translate-x-full transition-all duration-700 ease-in-out"
      }`}
    >
      {isOpen ? <SideBarLayer /> : ""}
    </div>
  );
};

export default SideBar;
