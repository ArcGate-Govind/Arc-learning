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
    pageValue = url.searchParams.get("page");
  } catch (error) {
    console.error("Error parsing URL:", error);
  }
}
const pageValueAsNumber = parseInt(pageValue);
const [currentPage, setCurrentPage] = useState(pageValueAsNumber || 1);

useEffect(() => {
  if (isLocalStorageAvailable) {
    localStorage.setItem("currentPageVideo", JSON.parse(currentPage));
  }
}, [currentPage]);

  return (
    <projectDetailsContext.Provider value={[currentPage, setCurrentPage]}>
      {props.children}
    </projectDetailsContext.Provider>
  );
};

export default VideoProjectCreateContext;
