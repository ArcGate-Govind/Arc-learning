"use client";

import React, { useEffect } from "react";
import { useState, createContext } from "react";

export const userDetailsContext = createContext();

const UserDetailsProvider = (props) => {
  const isLocalStorageAvailable =
    typeof window !== "undefined" && window.localStorage;

  // Try to get the currentPage from localStorage
  const storedCurrentPage = isLocalStorageAvailable
    ? JSON.parse(localStorage.getItem("currentPage"))
    : null;

  const [currentPage, setCurrentPage] = useState(storedCurrentPage || 1);

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
