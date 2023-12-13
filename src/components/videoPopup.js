"use client";

import React, { createRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import like from "@/image/Like.png";
import dislike from "@/image/dislike.png";
import comment from "@/image/comment1.png";
import { LOADING_MESSAGE } from "@/../../message";
import ModalBox from "./modalBox";

const VideoPopup = ({ onClose, data }) => {
  const [dataParams, setDataParams] = useState([data]);
  const [videoSeen, setVideoSeen] = useState({});
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

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

    dataParams.forEach((project) => {
      videoRefs.current[project.id] = createRef();
    });

    setDataParams(dataParams);
    setShowVideo(true);
    setLoading(false);
  }

  const updateTimeAfterSeenVideo = () => {
    let indexData = Object.keys(videoSeen).length;
    setShowVideo(false);
    if (indexData > 0 && dataParams.length > 0) {
      for (var i = 0; i < indexData; i++) {
        for (const key in videoSeen) {
          if (data.id == key) {
            const videoElement = videoRefs.current[key];
            const videoCurren = videoElement?.current;
            videoCurren.currentTime = videoSeen[key];
          }
        }
      }
    }
  };

  const getCurrentTime = (projectID) => {
    if (videoRefs.current[projectID]) {
      setVideoSeen((prevVideoSeen) => ({
        ...prevVideoSeen,
        [projectID]: videoRefs.current[projectID].current.currentTime,
      }));
    }
  };

  return (
    <>
      <ModalBox onClose={onClose}>
        {loading ? (
          <div class="text-black-600 text-center font-semibold py-3">
            {LOADING_MESSAGE}
          </div>
        ) : (
          <div class="m-auto mb-0 mt-2 w-full">
            {dataParams.map((project, index) => (
              <div
                key={index}
                class="flex flex-col items-center justify-center mb-4"
              >
                <video
                  ref={videoRefs.current[project.id]}
                  class="py-4 px-4 w-full h-full mx-auto"
                  alt="videoImage"
                  controlsList="nodownload"
                  controls
                  onPause={() => getCurrentTime(project.id)}
                >
                  <source src={project.VideoImage} type="video/mp4" />
                </video>
                <p class="font-medium text-[#000000] w-11/12 line-clamp-2 text-xs mb-1 ">
                  {data.id}____ {project.description}
                </p>
                <div class="sm:flex items-center justify-center w-full">
                  <div class="w-full md:w-80">
                    <p class="font-medium text-[#000000] line-clamp-2 text-xs">
                      projectName
                    </p>
                  </div>
                  <div class="sm:flex w-full md:w-2/3 lg:w-2/6 justify-around items-center">
                    <Image
                      class="mb-1 cursor-pointer"
                      alt="like"
                      width={20}
                      src={like}
                    />
                    <p class="font-medium text-[#000000] line-clamp-2 text-xs">
                      2K
                    </p>
                    <Image
                      class="cursor-pointer"
                      width={20}
                      alt="dislike"
                      src={dislike}
                    />
                    <Image
                      class="cursor-pointer"
                      width={20}
                      alt="comment"
                      src={comment}
                    />
                    <p class="font-medium text-[#000000] line-clamp-2 text-xs">
                      5 days ago
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalBox>
    </>
  );
};

export default VideoPopup;
