"use client";
import React, { createRef, useEffect, useRef } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  LOADING_MESSAGE,
  SEARCH_RESULT_MESSAGE,
  SEARCH_FIELD_MESSAGE,
} from "../../../../message";
import { API_URL, Backend_Localhost_Path } from "../../../../constant";
import VideoPopup from "@/components/videoPopup";
import {
  getAccessToken,
  getProjectName,
  removeUserSession,
} from "@/utils/common";
import { useRouter } from "next/navigation";

import moment from "moment";
import AOSWrapper from "@/components/aosWrapper";

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

  const accessToken = getAccessToken();
  const projectName = getProjectName();
  const router = useRouter();
  const videoRefs = useRef([]);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    updateTimeAfterSeenVideo();
  }, [data]);

  useEffect(() => {
    updateTimeAfterSeenVideo();
  }, [data]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollBar);
    const storedVideoSeen = localStorage.getItem("videoSeen");
    if (storedVideoSeen) {
      setVideoSeen(JSON.parse(storedVideoSeen));
    }

    return () => {
      window.removeEventListener("scroll", handleScrollBar);
    };
  }, []);

  useEffect(() => {
    const storedVideoSeen = localStorage.getItem("videoSeen");
    if (storedVideoSeen) {
      setVideoSeen(JSON.parse(storedVideoSeen));
    }
  }, [totalPages]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollBar);

    return () => {
      window.removeEventListener("scroll", handleScrollBar);
    };
  }, [totalPages, currentPage]);

  useEffect(() => {
    localStorage.setItem("videoSeen", JSON.stringify(videoSeen));
    updateTimeAfterSeenVideo();
  }, [videoSeen]);

  useEffect(() => {
    if (showVideo) {
      updateTimeAfterSeenVideo();
    }
  }, [showVideo, isPopoutOpen]);

  async function fetchData() {
    const queryParams = [];
    const isLocalStorageAvailable =
      typeof window !== "undefined" && window.localStorage;
    let values = isLocalStorageAvailable
      ? JSON.parse(localStorage.getItem("videoSearchValues"))
      : null;
    if (values != null) {
      if (values.projectSearch) {
        queryParams.push(`search=${values.projectSearch}`);
      }
    }

    queryParams.push(`project=${projectName}`);
    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    const newUrl = `${window.location.pathname}${queryString}`;
    window.history.replaceState({}, "", newUrl);
    videoRefs.current = {};

    const response = await fetch(
      `${API_URL}dashboard/media-list/${queryString}&page_size=5&page=${currentPage}`,
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

        if (currentPage != 1) {
          setData((prev) => [...prev, ...json.results]);
        } else {
          setData(json.results);
        }
      } else if (json.results.length == 0) {
        setData(json.results);
      } else {
        removeUserSession();
        localStorage.removeItem("videoSearchValues");
        router.push("/");
      }

      setLoading(false);
      setTotalPages(json.pagination.total_pages);
      setShowVideo(true);
    } else if (json.code == "token_not_valid") {
      removeUserSession();
      localStorage.removeItem("videoSearchValues");
      router.push("/");
    }

    // setLoading(false);
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
    if (innerHeight + scrollTop + 1 >= scrollHeight) {
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
    setDataParams(project);
    setPopoutOpen(true);
  };

  const closePopup = () => {
    setPopoutOpen(false);
  };

  return (
    <AOSWrapper>
      <div className=" mx-5 md:mx-10 my-10 bg-[#F8F8F8] ">
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

            <button
              className="p-2 bg-[#466EA1] text-[#FFFFFF] rounded cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
              type="submit"
              onClick={handleFormSubmit}
            >
              Search
            </button>
            <button
              className="p-2 bg-[#466EA1] text-[#FFFFFF] rounded cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
              type="submit"
              onClick={handleFormClear}
            >
              Clear
            </button>
          </div>
          {blankInputError && (
            <div className="text-red-500 block  text-center  pb-3 md:-mt-5">
              {SEARCH_FIELD_MESSAGE}
            </div>
          )}
        </form>
        {loading ? (
          <div className="text-black-600 text-center font-semibold py-3">
            {LOADING_MESSAGE}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap  ml-20 ">
              {data.length > 0 ? (
                data.map((project, index) => {
                  let converTime = moment(project.modified).fromNow();
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
    </AOSWrapper>
  );
};

export default VideoContainer;
