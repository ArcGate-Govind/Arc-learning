"use client";
import React from "react";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
  };
  let arrProjectName = [
    "All Projects",
    "Project 1",
    "Project 2",
    "Project 3",
    "Project 4",
  ];
  return (
    <div className="w-32 sm:w-48 text-center bg-[#E7E3E3]  text-[#4a4949f0] font-bold ">
      <div className="pt-20 p-2"></div>
      {arrProjectName.map((projectName, index) => {
        console.log("projectName", projectName, index);
        return (
          <div
            key={index}
            className={`hover:text-black  text-base p-2 cursor-pointer ${
              selectedTab === projectName ? "text-black" : ""
            }`}
            onClick={() => handleTabClick(projectName)}
          >
            {projectName}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
