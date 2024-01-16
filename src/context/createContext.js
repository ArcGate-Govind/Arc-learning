"use client";

import React from "react";
import { useState, createContext } from "react";

export const userDetailsContext = createContext();

const UserDetailsProvider = (props) => {
  // Check if localStorage is available in the client environment
  const isLocalStorageAvailable =
    typeof window !== "undefined" && window.localStorage;

  const urlString = isLocalStorageAvailable ? window.location.href : null;
  let pageValue = null;
  let perPageValue = null;
  let searchValuesObj = {};

  // Parse URL parameters if the URL string is available
  if (urlString) {
    try {
      const url = new URL(urlString);

      // Retrieve page and perPage values from URL parameters
      pageValue = url.searchParams.get("page");
      perPageValue = url.searchParams.get("page_size");

      // Retrieve search values from URL parameters
      searchValuesObj = {
        employeeId: url.searchParams.get("employee_id")
          ? url.searchParams.get("employee_id")
          : "",
        employeeName: url.searchParams.get("full_name")
          ? url.searchParams.get("full_name")
          : "",
        status: url.searchParams.get("status")
          ? url.searchParams.get("status")
          : "",
      };
    } catch (error) {
      console.error("Error parsing URL:", error);
    }
  }

  // Convert Value to a number
  const perPageResult = parseInt(perPageValue);
  const pageValueAsNumber = parseInt(pageValue);

  // State to manage the current page
  const [currentPage, setCurrentPage] = useState(pageValueAsNumber || 1);

  // State to manage selected perPage result
  const [selectedPerPageResult, setShowSelectedPerPageResult] = useState(
    perPageResult || 10
  );

  // State to manage selected search values
  const [selectedSearchValues, setShowSelectedSearchValues] =
    useState(searchValuesObj);

  return (
    <userDetailsContext.Provider
      value={{
        currentPageContext: [currentPage, setCurrentPage],
        selectedPerPageResultContext: [
          selectedPerPageResult,
          setShowSelectedPerPageResult,
        ],
        selectedSearchValuesContext: [
          selectedSearchValues,
          setShowSelectedSearchValues,
        ],
      }}
    >
      {props.children}
    </userDetailsContext.Provider>
  );
};

export default UserDetailsProvider;
