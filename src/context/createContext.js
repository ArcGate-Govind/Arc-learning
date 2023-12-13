"use client";

import React, { useEffect } from "react";
import { useState, createContext } from "react";


export const userDetailsContext = createContext();

const UserDetailsProvider = (props) => {
  const isLocalStorageAvailable =
    typeof window !== "undefined" && window.localStorage;

  const islocationAvailable = typeof window !== "undefined" && window.location;

  // Try to get the currentPage from localStorage
  const storedCurrentPage = isLocalStorageAvailable
    ? JSON.parse(localStorage.getItem("currentPage"))
    : null;
  const urlString = islocationAvailable ? window.location.href : null;
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
      localStorage.setItem("currentPage", JSON.parse(currentPage));
    }
  }, [currentPage]);

  return (
    <userDetailsContext.Provider value={[currentPage, setCurrentPage]}>
      {props.children}
    </userDetailsContext.Provider>
  );
};

export default UserDetailsProvider;
