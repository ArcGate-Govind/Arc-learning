"use client";
import React, { createRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import like from "../../../image/Like.png";
import dislike from "../../../image/dislike.png";
import comment from "../../../image/comment1.png";
import { LOADING_MESSAGE } from "../../../../message";
const VideoDetails = ({ params }) => {
  const [dataParams, setDataParams] = useState([]);
  const [videoSeen, setVideoSeen] = useState({});
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const projectDetails = [
    {
      id: 1,
      VideoImage: "/video.mp4",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
    },
    {
      id: 2,
      VideoImage: "/video.mp4",
      description:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
    },
    {
      id: 3,
      VideoImage: "/video.mp4",
      description:
        " when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
    },
    {
      id: 4,
      VideoImage: "/video.mp4",
      description:
        " when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
    },
    {
      id: 5,
      VideoImage: "/video.mp4",
      description:
        " when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
    },
  ];

  useEffect(() => {
    const storedVideoSeen = localStorage.getItem("videoSeen");
    if (storedVideoSeen) {
      setVideoSeen(JSON.parse(storedVideoSeen));
    }
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("videoSeen", JSON.stringify(videoSeen));
    updateTimeAfterSeenVideo();
  }, [videoSeen]);

  useEffect(() => {
    if (showVideo) {
      updateTimeAfterSeenVideo();
    }
  }, [showVideo]);

  const videoRefs = useRef([]);

  async function fetchData() {
    videoRefs.current = {};

    projectDetails.forEach((project) => {
      videoRefs.current[project.id] = createRef();
    });

    setDataParams(projectDetails);
    setShowVideo(true);
    setLoading(false);
  }

  const handleUpdateUrl = (id) => {
    console.log("id", id);
    const currentPath = `${window.location.pathname}`;
    const newPath = currentPath.replace(
      /\/videocontainer\/\d+/,
      `/videocontainer/${id}`
    );
    console.log("newPath", newPath);
    console.log("newUrl", currentPath);
    window.history.replaceState({}, "", newPath);
    window.location.reload();
  };

  const updateTimeAfterSeenVideo = () => {
    let indexData = Object.keys(videoSeen).length;
    let videoIdgetFromSData = [];
    setShowVideo(false);
    dataParams.filter((projectDetail) => {
      videoIdgetFromSData.push(projectDetail.id);
    });
    if (indexData > 0 && dataParams.length > 0) {
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

  const getCurrentTime = (index, projectID) => {
    console.log("projectID", projectID, videoRefs);
    if (videoRefs.current[projectID]) {
      setVideoSeen((prevVideoSeen) => ({
        ...prevVideoSeen,
        [projectID]: videoRefs.current[projectID].current.currentTime,
      }));
    }
  };

  return (
    <>
      {loading ? (
        <div className="text-black-600 text-center font-semibold py-3">
          {LOADING_MESSAGE}
        </div>
      ) : (
        <div className=" pt-2 m-auto mb-0 w-11/12 flex flex-wrap">
          <div className="w-3/4">
            <div className="m-auto mb-0 mt-5 justify-center items-center w-11/12">
              {dataParams.map((project, index) => {
                if (params.id == project.id) {
                  return (
                    <div key={index}>
                      <video
                        ref={videoRefs.current[project.id]}
                        width={800}
                        className="py-4"
                        alt="videoImage"
                        controlsList="nodownload"
                        controls
                        // autoPlay
                        onPause={() => getCurrentTime(index, project.id)}
                      >
                        <source src={project.VideoImage} type="video/mp4" />
                      </video>
                      <p className="font-medium text-[#000000] w-11/12 line-clamp-2 text-xs mb-1">
                        {project.description}
                      </p>
                      <div className="sm:flex">
                        <div className="w-80">
                          <p className=" font-medium text-[#000000]  line-clamp-2 text-xs">
                            projectName _____{project.id}
                          </p>
                        </div>
                        <div className="sm:flex w-2/6 justify-between justify-center items-center">
                          <Image
                            className="mb-1 cursor-pointer"
                            alt="like"
                            width={20}
                            src={like}
                          />
                          <p className=" font-medium text-[#000000]  line-clamp-2 text-xs">
                            2K
                          </p>
                          <Image
                            className="cursor-pointer"
                            width={20}
                            alt="dislike"
                            src={dislike}
                          />
                          <Image
                            className="cursor-pointer"
                            width={20}
                            alt="comment"
                            src={comment}
                          />
                          <p className=" font-medium text-[#000000]  line-clamp-2 text-xs">
                            5 days ago
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <div className="w-3/12">
            <div className="custom-scrollbar m-auto mb-0 w-3/4  flex flex-wrap justify-center items-center overflow-y-auto max-h-[600px]">
              {dataParams.map((project, index) => {
                if (params.id != project.id) {
                  return (
                    <div
                      key={index}
                      className="hover:scale-95"
                      onClick={() => handleUpdateUrl(project.id)}
                    >
                      <div className="relative">
                        <video
                          ref={videoRefs.current[project.id]}
                          width={240}
                          className="py-4 "
                          alt="videoImage"
                          controlsList="nodownload"
                          controls
                          onPause={() => getCurrentTime(index, project.id)}
                        >
                          <source src={project.VideoImage} type="video/mp4" />
                        </video>
                      </div>
                      <p className="font-medium text-[#000000] w-3/5 line-clamp-2 text-xs mb-1">
                        _____{project.id} {project.description}
                      </p>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoDetails;
