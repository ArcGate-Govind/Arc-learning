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
  let videosearchValuesObj = {};
  let questionnaireSearchValuesObj = {};
  let videoPageValue = null;
  let projectName = null;
  let userPageValue = null;
  let questionnairePageValue = null;

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
      questionnairePageValue = url.searchParams.get("questionnairePage");

      // Retrieve search values from URL parameters
      videosearchValuesObj = {
        projectSearch: url.searchParams.get("search")
          ? url.searchParams.get("search")
          : "",
      };
      questionnaireSearchValuesObj = {
        assessmentSearch: url.searchParams.get("assessmentSearch")
          ? url.searchParams.get("assessmentSearch")
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
  const questionnairePageValueNumber = parseInt(questionnairePageValue);

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
    useState(videosearchValuesObj);

  // State to manage selected questionnaire search values
  const [
    selectedQuestionnaireSearchValues,
    setShowSelectedQuestionnaireSearchValues,
  ] = useState(questionnaireSearchValuesObj);

  // State to manage selected project values
  const [selectedProject, setShowSelectedProject] = useState(projectName);

  // State to manage the questionnaire current page
  const [questionnaireCurrentPage, setQuestionnaireCurrentPage] = useState(
    questionnairePageValueNumber || 1
  );

  return (
    <userDetailsContext.Provider
      value={{
        currentPageContext: [currentPage, setCurrentPage],
        userCurrentPageContext: [userCurrentPage, setUserCurrentPage],
        videoCurrentPageContext: [videoCurrentPage, setVideouCurrentPage],
        questionnaireCurrentPageContext: [
          questionnaireCurrentPage,
          setQuestionnaireCurrentPage,
        ],
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
        selectedQuestionnaireSearchValuesContext: [
          selectedQuestionnaireSearchValues,
          setShowSelectedQuestionnaireSearchValues,
        ],
        selectedProjectContext: [selectedProject, setShowSelectedProject],
      }}
    >
      {props.children}
    </userDetailsContext.Provider>
  );
};

export default UserDetailsProvider;
