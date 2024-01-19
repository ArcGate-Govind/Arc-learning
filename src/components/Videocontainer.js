"use client";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  LOADING_MESSAGE,
  SEARCH_RESULT_MESSAGE,
  SEARCH_FIELD_MESSAGE,
} from "../../message";
import { API_URL, Backend_Localhost_Path } from "../../constant";
import VideoPopup from "@/components/videoPopup";
import moment from "moment";
import AOSWrapper from "@/components/aosWrapper";
import Dashboard from "@/components/dashboard";
import { userDetailsContext } from "@/context/createContext";
import Pagination from "./pagination";
import ResultPerPage from "./resultPerPage";
import { api } from "@/utils/helper";

const VideoContainer = () => {
  // Destructuring context values
  const {
    selectedVideoSearchValuesContext,
    videoCurrentPageContext,
    selectedPerPageResultContext,
    selectedProjectContext,
  } = useContext(userDetailsContext);

  // Extracting values from context
  const [selectedVideoSearchValues, setShowSelectedVideoSearchValues] =
    selectedVideoSearchValuesContext;
  const [videoCurrentPage, setVideouCurrentPage] = videoCurrentPageContext;
  const [selectedPerPageResult, setShowSelectedPerPageResult] =
    selectedPerPageResultContext;
  const [selectedProject, setShowSelectedProject] = selectedProjectContext;

  // State variables
  const [blankInputError, setBlankInputError] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopoutOpen, setPopoutOpen] = useState(false);
  const [dataParams, setDataParams] = useState();
  const [dashboardData, setdashboardData] = useState();

  // useEffect to fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [videoCurrentPage, selectedVideoSearchValues, selectedPerPageResult]);

  // Async function to fetch data from the API
  const fetchData = async () => {
    const queryParams = [];

    if (selectedVideoSearchValues != null) {
      if (selectedVideoSearchValues.projectSearch) {
        queryParams.push(`search=${selectedVideoSearchValues.projectSearch}`);
      }
    }

    queryParams.push(`project=${selectedProject}`);
    queryParams.push(`page_size=${selectedPerPageResult}`);
    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    const newUrl = `${window.location.pathname}${queryString}&videopage=${videoCurrentPage}`;
    window.history.replaceState({}, "", newUrl);

    const response = await api.get(
      `${API_URL}dashboard/media-list/${queryString}&page=${videoCurrentPage}`
    );

    const json = response.data;
    if (json.code === 200) {
      let arrDashboard = {
        username: json.usernames,
        project: json.project,
      };
      setdashboardData(arrDashboard);

      if (json.results.length > 0) {
        setData(json.results);
      } else if (json.results.length === 0) {
        setData(json.results);
      }

      setLoading(false);
      setTotalPages(json.pagination.total_pages);
    }
  };

  // Validation schema for formik
  const validationSchema = Yup.object()
    .shape({
      projectSearch: Yup.string(),
    })
    .test({ SEARCH_FIELD_MESSAGE }, function (values) {
      return !!values.projectSearch;
    });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      projectSearch: selectedVideoSearchValues.projectSearch,
    },
    validationSchema,
    onSubmit: (values) => {
      const trimedValue = {
        projectSearch: values.projectSearch.trim(),
      };
      if (trimedValue.projectSearch != "") {
        setShowSelectedVideoSearchValues(trimedValue);
      }
      if (searchClear) {
        setBlankInputError(false);
      } else if (!trimedValue.projectSearch && !searchClear) {
        setBlankInputError(true);
      } else {
        setBlankInputError(false);
      }
    },
  });

  // Function to handle form submission
  const handleFormSubmit = () => {
    if (!formik.values.projectSearch) {
      setBlankInputError(true);
    } else {
      setBlankInputError(false);
      setVideouCurrentPage(1);
    }
  };

  // Function to handle form clear
  const handleFormClear = () => {
    setSearchClear(true);
    const newUrl = `${window.location.pathname}?project=${selectedProject}&videopage=${videoCurrentPage}`;
    window.history.replaceState({}, "", newUrl);
    window.location.reload();
  };

  // Function to open video popup
  const openPopup = (project) => {
    setDataParams(project);
    setPopoutOpen(true);
  };

  // Function to close video popup
  const closePopup = () => {
    setPopoutOpen(false);
  };

  // Rendering JSX
  return (
    <AOSWrapper>
      {/* Dashboard component displaying data */}
      <Dashboard dashboardData={dashboardData} />

      <div className=" mx-5 md:mx-10 my-10 bg-[#F8F8F8] ">
        {/* Form  */}
        <form
          className="mx-5 md:mx-10 mt-10  p-2 md:p-4"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex justify-center gap-x-3 mb-8">
            <input
              type="text"
              name="projectSearch"
              className="w-1/2 md:w-1/4 rounded px-5 border-2 border-gray-200"
              placeholder="Search"
              onChange={formik.handleChange}
              value={formik.values.projectSearch}
              onBlur={formik.handleBlur}
            />

            {/* Button to submit search form */}
            <button
              className="p-2 bg-[#466EA1] text-[#FFFFFF] rounded cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
              type="submit"
              onClick={handleFormSubmit}
            >
              Search
            </button>

            {/* Button to clear search form */}
            <button
              className="p-2 bg-[#466EA1] text-[#FFFFFF] rounded cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
              type="submit"
              onClick={handleFormClear}
            >
              Clear
            </button>

            {/* Component to select results per page */}
            <ResultPerPage
              setShowSelectedPerPageResult={setShowSelectedPerPageResult}
              selectedPerPageResult={selectedPerPageResult}
              setCurrentPage={setVideouCurrentPage}
            />
          </div>

          {/* Display error message if there's a blank input */}
          {blankInputError && (
            <div className="text-red-500 block  text-center  pb-3 md:-mt-5">
              {SEARCH_FIELD_MESSAGE}
            </div>
          )}
        </form>

        {/* Display loading message or video data */}
        {loading ? (
          <div className="text-black-600 text-center font-semibold py-3">
            {LOADING_MESSAGE}
          </div>
        ) : (
          <>
            {/* Display videos */}
            <div className="flex flex-wrap ml-5">
              {data.length > 0 ? (
                data.map((project, index) => {
                  let converTime = moment(project.created).fromNow();
                  let videoImagePath = `${Backend_Localhost_Path}${project.screenshot}`;

                  return (
                    <div
                      key={index}
                      onClick={() => openPopup(project)}
                      data-aos="fade-up"
                      data-aos-duration="1400"
                      className="hover:scale-95 cursor-pointer  mb-0  md:w-[20%] sm:w-1/2 relative"
                    >
                      <video
                        poster={videoImagePath}
                        className="py-2 w-[90%] custom-video-player"
                        controls
                        controlsList="nodownload"
                        disablePictureInPicture
                      />

                      <div className="flex w-[90%] ">
                        <p
                          title={project.title}
                          className="font-medium  text-[#000000] w-3/4  line-clamp-2 text-xs"
                        >
                          {project.title}
                        </p>
                        <p className="font-medium text-[#000000] w-3/4  line-clamp-2 text-xs">
                          {converTime}
                        </p>
                      </div>
                      <p
                        title={project.description}
                        className={`font-medium text-[#000000] w-[90%]  line-clamp-2 text-xs mb-1  mb-4`}
                      >
                        {project.description}
                      </p>
                    </div>
                  );
                })
              ) : (
                // Display message if there are no search results
                <div className="text-red-600 text-center py-3">
                  {SEARCH_RESULT_MESSAGE}
                </div>
              )}
            </div>

            {/* Display pagination if there are multiple pages */}
            {data.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={videoCurrentPage}
                setCurrentPage={setVideouCurrentPage}
                totalPages={totalPages}
                isConfirmModal={true}
              />
            )}

            {/* Display video popup if it's open */}
            {isPopoutOpen && (
              <VideoPopup data={dataParams} onClose={closePopup} />
            )}
          </>
        )}
      </div>
    </AOSWrapper>
  );
};

export default VideoContainer;
