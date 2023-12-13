"use client";
import React, { createRef, useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  LOADING_MESSAGE,
  SEARCH_RESULT_MESSAGE,
  SEARCH_FIELD_MESSAGE,
} from "@/../../message";
import { API_URL } from "@/../../constant";
import VideoPopup from "@/components/videoPopup";

const VideoContainer = () => {
  const [videoSeen, setVideoSeen] = useState({});
  const [blankInputError, setBlankInputError] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopoutOpen, setPopoutOpen] = useState(false);
  const [dataParams, setDataParams] = useState();

  const projectDetailsAll = [
    {
      id: 1,
      VideoImage: "/video.mp4",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting m is simply dummy text of the printing and typesetting  industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
      projectName: "Project1",
      time: " 5 days ago",
    },
    {
      id: 2,
      VideoImage: "/video.mp4",
      description:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
      projectName: "Project1",
      time: " 3 days ago",
    },
    {
      id: 3,
      VideoImage: "/video.mp4",
      description:
        " when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
      projectName: "Project2",
      time: "4 days ago",
    },
    {
      id: 4,
      VideoImage: "/video.mp4",
      description:
        "a galleyof type and scrambled it to make a type specimen book",
      projectName: "Project2",
      time: "6 days ago",
    },
    {
      id: 5,
      VideoImage: "/video.mp4",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting a type specimen book",
      projectName: "Project3",
      time: "9 days ago",
    },
    {
      id: 6,
      VideoImage: "/video.mp4",
      description:
        "Lorem Ipsum is lllllllll lllllllll simply dummy text of the printing and typesetting a type specimen book",
      projectName: "Project3",
      time: "9 days ago",
    },
    {
      id: 7,
      VideoImage: "/video.mp4",
      description:
        "Lorem Ipsum is lllllllll lllllllll simply dummy text of the printing and typesetting a type specimen book",
      projectName: "Project3",
      time: "9 days ago",
    },
    {
      id: 8,
      VideoImage: "/video.mp4",
      description:
        "Lorem Ipsum is lllllllll lllllllll simply dummy text of the printing and typesetting a type specimen book",
      projectName: "Project3",
      time: "9 days ago",
    },
    {
      id: 9,
      VideoImage: "/video.mp4",
      description:
        "Lorem Ipsum is lllllllll lllllllll simply dummy text of the printing and typesetting a type specimen book",
      projectName: "Project3",
      time: "9 days ago",
    },
    {
      id: 10,
      VideoImage: "/video.mp4",
      description:
        "Lorem Ipsum is lllllllll lllllllll simply dummy text of the printing and typesetting a type specimen book",
      projectName: "Project3",
      time: "9 days ago",
    },
    {
      id: 11,
      VideoImage: "/video.mp4",
      description:
        "Lorem Ipsum is lllllllll lllllllll simply dummy text of the printing and typesetting a type specimen book",
      projectName: "Project3",
      time: "9 days ago",
    },
    {
      id: 12,
      VideoImage: "/video.mp4",
      description:
        "Lorem Ipsum is lllllllll lllllllll simply dummy text of the printing and typesetting a type specimen book",
      projectName: "Project3",
      time: "9 days ago",
    },
  ];

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, [currentPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollBar);
    const storedVideoSeen = localStorage.getItem("videoSeen");
    if (storedVideoSeen) {
      setVideoSeen(JSON.parse(storedVideoSeen));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("videoSeen", JSON.stringify(videoSeen));
    updateTimeAfterSeenVideo();
  }, [videoSeen]);

  useEffect(() => {
    if (showVideo) {
      updateTimeAfterSeenVideo();
    }
  }, [showVideo, isPopoutOpen]);

  const videoRefs = useRef([]);

  async function fetchData() {
    const queryParams = [];
    const isLocalStorageAvailable =
      typeof window !== "undefined" && window.localStorage;

    let values = isLocalStorageAvailable
      ? JSON.parse(localStorage.getItem("videoSearchValues"))
      : null;

    if (values != null) {
      if (values.projectSearch) {
        queryParams.push(`projectSearch=${values.projectSearch}`);
      }
    }

    queryParams.push(`page=${currentPage}`);
    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    const newUrl = `${window.location.pathname}${queryString}`;
    window.history.replaceState({}, "", newUrl);
    videoRefs.current = {};
    projectDetailsAll.forEach((project) => {
      videoRefs.current[project.id] = createRef();
    });
    setData(projectDetailsAll);
    setShowVideo(true);

    const response = await fetch(`${API_URL}users/${queryParams}`, {});
    const json = await response.json();
  }

  const validationSchema = Yup.object()
    .shape({
      projectSearch: Yup.string(),
    })
    .test({ SEARCH_FIELD_MESSAGE }, function (values) {
      return !!values.projectSearch;
    });

  const isLocalStorageAvailable =
    typeof window !== "undefined" && window.localStorage;
  let searchValue = isLocalStorageAvailable
    ? JSON.parse(localStorage.getItem("videoSearchValues"))
    : null;
  if (searchValue == null) {
    searchValue = { projectSearch: "" };
  }

  const formik = useFormik({
    initialValues: {
      projectSearch: searchValue.projectSearch,
    },
    validationSchema,
    onSubmit: (values) => {
      let searchValues = {
        projectSearch: "",
      };
      localStorage.setItem(
        "videoSearchValues",
        JSON.stringify(searchClear ? searchValues : values)
      );
      if (searchClear) {
        setBlankInputError(false);
      } else if (!values.projectSearch && !searchClear) {
        setBlankInputError(true);
      } else {
        setBlankInputError(false);
        const queryParams = [];
        if (values.projectSearch)
          queryParams.push(`projectSearch=${values.projectSearch}`);
        fetchData();
      }
    },
  });

  const handleScrollBar = () => {
    const innerHeight = window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    if (innerHeight + scrollTop == scrollHeight) {
      loadMorePageData();
    }
  };
  const loadMorePageData = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFormSubmit = () => {
    if (!formik.values.projectSearch) {
      setBlankInputError(true);
    } else {
      setBlankInputError(false);
      setCurrentPage(1);
    }
  };

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
              const videoCurren = videoElement?.current;
              videoCurren.currentTime = videoSeen[key];
            }
          });
        }
      }
    }
  };

  const handleFormClear = () => {
    localStorage.removeItem("videoSearchValues");
    setSearchClear(true);
    window.location.reload();
  };

  const getCurrentTime = (projectID) => {
    if (videoRefs.current[projectID]) {
      setVideoSeen((prevVideoSeen) => ({
        ...prevVideoSeen,
        [projectID]: videoRefs.current[projectID].current.currentTime,
      }));
    }
  };

  const openPopup = (project) => {
    console.log("id", project);
    setDataParams(project);
    setPopoutOpen(true);
  };

  const closePopup = () => {
    setPopoutOpen(false);
  };

  return (
    <div className="flex">
      <div className="w-screen bg-[#F8F8F8] ">
        <form onSubmit={formik.handleSubmit}>
          <div className="text-center">
            <div className="md:flex justify-center items-center md:h-24">
              <div className="pt-5 md:p-5 md:flex gap-4 text-center md:text-left">
                <input
                  type="text"
                  name="projectSearch"
                  className="w-44 sm:w-80  h-8 md:h-9 px-3 border-[#C5C6C8] border rounded-md mb-2 md:mb-0"
                  placeholder="Search"
                  onChange={formik.handleChange}
                  value={formik.values.projectSearch}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className=" text-center md:text-left mr-3 md:mr-0">
                <button
                  className=" hover:text-[#466EA1]  hover:bg-gray-200 bg-[#466EA1] text-[#FFFFFF]  p-2 rounded-md md:text-sm uppercase mb-1 mx-auto md:ml-2 md:mb-0 "
                  type="submit"
                  onClick={handleFormSubmit}
                >
                  Search
                </button>
                <button
                  className="bg-[#466EA1] text-[#FFFFFF]  hover:bg-gray-200  hover:text-[#466EA1] p-2 rounded-md md:text-sm uppercase mb-3 sm:ml-2 md:mx-auto md:ml-2 md:mb-0 "
                  type="submit"
                  onClick={handleFormClear}
                >
                  Clear
                </button>
              </div>
            </div>
            {blankInputError && (
              <div className="text-red-500 block pb-3 md:-mt-5">
                {SEARCH_FIELD_MESSAGE}
              </div>
            )}
          </div>
        </form>
        {loading ? (
          <div className="text-black-600 text-center font-semibold py-3">
            {LOADING_MESSAGE}
          </div>
        ) : (
          <>
            <div className="m-auto mb-0 w-11/12 flex flex-wrap justify-center items-center ">
              {data.length > 0 ? (
                data.map((project, index) => {
                  return (
                    <div
                      key={index}
                      className="hover:scale-95 w-1/1 md:w-1/4 sm:w-1/2 relative"
                    >
                      <div>
                        <div className=" py-2">
                          <video
                            ref={videoRefs.current[project.id]}
                            className="py-2 w-3/4 custom-video-player"
                            controls
                            onPause={() => getCurrentTime(project.id)}
                            controlsList="nodownload"
                            disablePictureInPicture
                          >
                            <source src={project.VideoImage} type="video/mp4" />
                          </video>
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => openPopup(project)}
                        >
                          <p
                            className={`font-medium text-[#000000]  w-4/5 line-clamp-2 text-xs mb-1`}
                          >
                            {project.description}
                          </p>
                          <div className="flex">
                            <p
                              className={`font-medium  text-[#000000] w-4/5 line-clamp-2 text-xs`}
                            >
                              {project.projectName}
                            </p>
                            <p
                              className={`font-medium text-[#000000] w-4/5 line-clamp-2 text-xs`}
                            >
                              {project.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-red-600 text-center py-3">
                  {SEARCH_RESULT_MESSAGE}
                </div>
              )}
            </div>

            {isPopoutOpen && (
              <VideoPopup data={dataParams} onClose={closePopup} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoContainer;
