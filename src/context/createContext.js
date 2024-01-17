"use client";

import React, { use } from "react";
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
  let VideosearchValuesObj = {};
  let videoPageValue = null;
  let projectName = "test";
  let userPageValue = null;

  // Parse URL parameters if the URL string is available
  if (urlString) {
    try {
      const url = new URL(urlString);

      // Retrieve page and perPage values from URL parameters
      pageValue = url.searchParams.get("page");
      userPageValue = url.searchParams.get("userpage");
      perPageValue = url.searchParams.get("page_size");
      videoPageValue = url.searchParams.get("videopage");
      projectName = url.searchParams.get("project");

      // Retrieve search values from URL parameters
      VideosearchValuesObj = {
        projectSearch: url.searchParams.get("search")
          ? url.searchParams.get("search")
          : "",
      };
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
  const videoPageValueAsNumber = parseInt(videoPageValue);
  const userPageValueAsNumber = parseInt(userPageValue);

  // State to manage the current page
  const [currentPage, setCurrentPage] = useState(pageValueAsNumber || 1);

  // State to manage the userDetails current page
  const [userCurrentPage, setUserCurrentPage] = useState(
    userPageValueAsNumber || 1
  );

  // State to manage the video current page
  const [videoCurrentPage, setVideouCurrentPage] = useState(
    videoPageValueAsNumber || 1
  );

  // State to manage selected perPage result
  const [selectedPerPageResult, setShowSelectedPerPageResult] = useState(
    perPageResult || 10
  );

  // State to manage selected search values
  const [selectedSearchValues, setShowSelectedSearchValues] =
    useState(searchValuesObj);

  // State to manage selected video search values
  const [selectedVideoSearchValues, setShowSelectedVideoSearchValues] =
    useState(VideosearchValuesObj);

  // State to manage selected project values
  const [selectedProject, setShowSelectedProject] = useState(projectName);

  return (
    <userDetailsContext.Provider
      value={{
        currentPageContext: [currentPage, setCurrentPage],
        userCurrentPageContext: [userCurrentPage, setUserCurrentPage],
        videoCurrentPageContext: [videoCurrentPage, setVideouCurrentPage],
        selectedPerPageResultContext: [
          selectedPerPageResult,
          setShowSelectedPerPageResult,
        ],
        selectedSearchValuesContext: [
          selectedSearchValues,
          setShowSelectedSearchValues,
        ],
        selectedVideoSearchValuesContext: [
          selectedVideoSearchValues,
          setShowSelectedVideoSearchValues,
        ],
        selectedProjectContext: [selectedProject, setShowSelectedProject],
      }}
    >
      {props.children}
    </userDetailsContext.Provider>
  );
};

export default UserDetailsProvider;
