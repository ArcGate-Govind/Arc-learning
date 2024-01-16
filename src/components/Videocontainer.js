"use client";
import React, { createRef, useContext, useEffect, useRef } from "react";
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
import { getAccessToken, removeUserSession } from "@/utils/common";
import { useRouter } from "next/navigation";
import moment from "moment";
import AOSWrapper from "@/components/aosWrapper";
import Dashboard from "@/components/dashboard";
import { userDetailsContext } from "@/context/createContext";
import Pagination from "./pagination";
import ResultPerPage from "./resultPerPage";

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
  const [videoSeen, setVideoSeen] = useState({});
  const [blankInputError, setBlankInputError] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopoutOpen, setPopoutOpen] = useState(false);
  const [dataParams, setDataParams] = useState();
  const accessToken = getAccessToken();
  const router = useRouter();
  const videoRefs = useRef([]);

  // useEffect to fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [videoCurrentPage, selectedVideoSearchValues, selectedPerPageResult]);

  // useEffect to update time after seeing a video
  useEffect(() => {
    updateTimeAfterSeenVideo();
  }, [data]);

  // useEffect to load stored videoSeen from localStorage
  useEffect(() => {
    const storedVideoSeen = localStorage.getItem("videoSeen");
    if (storedVideoSeen) {
      setVideoSeen(JSON.parse(storedVideoSeen));
    }
  }, []);

  // useEffect to update videoSeen when totalPages change
  useEffect(() => {
    const storedVideoSeen = localStorage.getItem("videoSeen");
    if (storedVideoSeen) {
      setVideoSeen(JSON.parse(storedVideoSeen));
    }
  }, [totalPages]);

  // useEffect to save videoSeen to localStorage and update time after seeing a video
  useEffect(() => {
    localStorage.setItem("videoSeen", JSON.stringify(videoSeen));
    updateTimeAfterSeenVideo();
  }, [videoSeen]);

  // useEffect to update time after seeing a video when showVideo or isPopoutOpen changes
  useEffect(() => {
    if (showVideo) {
      updateTimeAfterSeenVideo();
    }
  }, [showVideo, isPopoutOpen]);

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
    videoRefs.current = {};

    const response = await fetch(
      `${API_URL}dashboard/media-list/${queryString}&page=${videoCurrentPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const json = await response.json();
    if (json.code == 200) {
      if (json.results.length > 0) {
        json.results.forEach((project) => {
          videoRefs.current[project.id] = createRef();
        });
        setData(json.results);
      } else if (json.results.length == 0) {
        setData(json.results);
      } else {
        removeUserSession();

        router.push("/");
      }

      setLoading(false);
      setTotalPages(json.pagination.total_pages);
      setShowVideo(true);
    } else if (json.code == "token_not_valid") {
      removeUserSession();

      router.push("/");
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

  // Function to update time after seeing a video
  const updateTimeAfterSeenVideo = () => {
    let indexData = Object.keys(videoSeen).length;
    let videoIdgetFromSData = [];
    setShowVideo(false);
    data.filter((projectDetail) => {
      videoIdgetFromSData.push(projectDetail.id);
    });
    if (indexData > 0 && data.length > 0) {
      for (var i = 0; i < indexData; i++) {
        for (const key in videoSeen) {
          videoIdgetFromSData.filter((projectId) => {
            if (projectId == key) {
              const videoElement = videoRefs.current[key];
              if (videoElement && videoElement.current) {
                const videoCurren = videoElement?.current;
                videoCurren.currentTime = videoSeen[key];
              }
            }
          });
        }
      }
    }
  };

  // Function to handle form clear
  const handleFormClear = () => {
    setSearchClear(true);
    const newUrl = `${window.location.pathname}?page=${videoCurrentPage}`;
    window.history.replaceState({}, "", newUrl);
    window.location.reload();
  };

  // Function to get current time of a video
  const getCurrentTime = (projectID) => {
    if (videoRefs.current[projectID]) {
      setVideoSeen((prevVideoSeen) => ({
        ...prevVideoSeen,
        [projectID]: videoRefs.current[projectID].current.currentTime,
      }));
    }
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
      <Dashboard dashboardData={data} />

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
            <div className="flex flex-wrap  ml-20 ">
              {data.length > 0 ? (
                data.map((project, index) => {
                  let converTime = moment(project.created).fromNow();
                  let videoPath = `${Backend_Localhost_Path}${project.file}`;

                  return (
                    <div
                      key={index}
                      data-aos="fade-up"
                      data-aos-duration="1400"
                      className="hover:scale-95  mb-0  md:w-3/12 sm:w-1/2 relative"
                    >
                      <video
                        ref={videoRefs.current[project.id]}
                        className="py-2 w-3/4 custom-video-player"
                        controls
                        onPause={() => getCurrentTime(project.id)}
                        controlsList="nodownload"
                        disablePictureInPicture
                      >
                        <source src={videoPath} type="video/mp4" />
                      </video>

                      <div
                        className="cursor-pointer "
                        onClick={() => openPopup(project)}
                      >
                        <div className="flex w-10/12 ">
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
                          className={`font-medium text-[#000000] w-3/4  line-clamp-2 text-xs mb-1  mb-4`}
                        >
                          {project.description}
                        </p>
                      </div>
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
