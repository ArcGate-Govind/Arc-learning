"use client";
import React, { useEffect } from "react";
import { useState, createContext } from "react";

export const projectDetailsContext = createContext();

const VideoProjectCreateContext = (props) => {
  const isLocalStorageAvailable =
    typeof window !== "undefined" && window.localStorage;

  const urlString = isLocalStorageAvailable ? window.location.href : null;
  let pageValue = null;
  if (urlString) {
    try {
      const url = new URL(urlString);
      pageValue = url.searchParams.get("project");
    } catch (error) {
      console.error("Error parsing URL:", error);
    }
  }

  const [selectedTab, setSelectedTab] = useState(pageValue || "AllProjects");

  useEffect(() => {
    if (isLocalStorageAvailable) {
      localStorage.setItem("selectedTab", selectedTab);
    }
  }, [selectedTab]);

  return (
    <projectDetailsContext.Provider value={[selectedTab, setSelectedTab]}>
      {props.children}
    </projectDetailsContext.Provider>
  );
};

export default VideoProjectCreateContext;
