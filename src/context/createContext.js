"use client";

import React, { useEffect } from "react";
import { useState, createContext } from "react";

export const userDetailsContext = createContext();

const UserDetailsProvider = (props) => {
  const isLocalStorageAvailable =
    typeof window !== "undefined" && window.localStorage;

  const urlString = isLocalStorageAvailable ? window.location.href : null;
  let pageValue = null;
  let perPageValue = null;
  if (urlString) {
    try {
      const url = new URL(urlString);
      pageValue = url.searchParams.get("page");
    } catch (error) {
      console.error("Error parsing URL:", error);
    }
  }
  if (isLocalStorageAvailable) {
    try {
      perPageValue = JSON.parse(localStorage.getItem("resultPerPage"));
    } catch (error) {
      console.error("Error parsing URL:", error);
    }
  }
  const perPageResult = parseInt(perPageValue);
  const pageValueAsNumber = parseInt(pageValue);
  const [currentPage, setCurrentPage] = useState(pageValueAsNumber || 1);
  const [selectedPerPageResult, setShowSelectedPerPageResult] = useState(
    perPageResult || 2
  );

  useEffect(() => {
    if (isLocalStorageAvailable) {
      localStorage.setItem("resultPerPage", JSON.parse(selectedPerPageResult));
    }
  }, [selectedPerPageResult]);

  useEffect(() => {
    if (isLocalStorageAvailable) {
      localStorage.setItem("currentPage", JSON.parse(currentPage));
    }
  }, [currentPage]);
  return (
    <userDetailsContext.Provider
      value={{
        currentPageContext: [currentPage, setCurrentPage],
        selectedPerPageResultContext: [
          selectedPerPageResult,
          setShowSelectedPerPageResult,
        ],
      }}
    >
      {props.children}
    </userDetailsContext.Provider>
  );
};

export default UserDetailsProvider;
