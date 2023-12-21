"use client";

import React, { createRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import like from "@/image/Like.png";
import dislike from "@/image/dislike.png";
import comment from "@/image/comment1.png";
import { LOADING_MESSAGE } from "@/../../message";
import ModalBox from "./modalBox";
import moment from "moment";
import { API_URL, Backend_Localhost_Path } from "../../constant";
import { getAccessToken } from "@/utils/common";

const VideoPopup = ({ onClose, data }) => {
  const [dataParams, setDataParams] = useState([data]);
  const [videoSeen, setVideoSeen] = useState({});
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [likeData, setLikeData] = useState(1);
  const [showLike, setShowLike] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const accessToken = getAccessToken();

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

  const handleLikeUpdate = async (totalLike, projectId) => {
    const response = await fetch(`${API_URL}dashboard/likes/${149}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const json = await response.json();
    console.log("json", json);

    if (totalLike >= 0 && json.status == 200) {
      setLikeData(totalLike + 1);
      setShowLike(true);
    }
  };

  const handleUnlikeUpdate = async (totalLike, projectId) => {
    if (totalLike > 0) {
      setLikeData(totalLike - 1);
      setShowLike(true);
    }
  };

  return (
    <>
      <ModalBox onClose={onClose}>
        {loading ? (
          <div className="text-black-600 text-center font-semibold py-3">
            {LOADING_MESSAGE}
          </div>
        ) : (
          <div className="m-auto mb-0 mt-2 w-full">
            {dataParams.length > 0 &&
              dataParams.map((project, index) => {
                let converTime = moment(project.modified).fromNow();
                let videoPath = `${Backend_Localhost_Path}${project.file}`;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center mb-4"
                  >
                    <video
                      ref={videoRefs.current[project.id]}
                      className="py-4 px-4 w-full h-full mx-auto"
                      alt="videoImage"
                      controlsList="nodownload"
                      controls
                      onPause={() => getCurrentTime(project.id)}
                    >
                      <source src={videoPath} type="video/mp4" />
                    </video>
                    <p className="font-medium text-[#000000] w-11/12 line-clamp-2 text-xs mb-1 ">
                      {data.id}____ {project.description}
                    </p>

                    <div className="flex w-11/12  justify-around ">
                      <span
                        onClick={() =>
                          handleLikeUpdate(project.total_likes, project.id)
                        }
                        className="mb-1 text-lg"
                      >
                        <i
                          className={`${
                            showIcon
                              ? " fa fa-thumbs-up cursor-not-allowed"
                              : " fa fa-thumbs-o-up cursor-pointer"
                          }`}
                        ></i>
                      </span>

                      {/* <Image
                        onClick={() =>
                          handleLikeUpdate(project.total_likes, project.id)
                        }
                        className={` mb-1 ${
                          showLike ? "cursor-not-allowed" : " cursor-pointer"
                        }`}
                        alt="like"
                        width={20}
                        src={like}
                      /> */}
                      <p className="font-medium text-[#000000] line-clamp-2 text-xs">
                        {showLike ? likeData : project.total_likes}
                      </p>

                      <span className="mb-1 text-lg">
                        <i
                          className={`${
                            !showIcon
                              ? " fa fa-thumbs-up cursor-not-allowed"
                              : " fa fa-thumbs-o-up cursor-pointer"
                          }`}
                        ></i>
                      </span>

                      {/* <Image
                        onClick={() =>
                          handleUnlikeUpdate(project.total_likes, project.id)
                        }
                        className="cursor-pointer"
                        width={20}
                        alt="dislike"
                        src={dislike}
                      /> */}
                      {/* <Image
                        className="cursor-pointer"
                        width={20}
                        alt="comment"
                        src={comment}
                      /> */}
                      <span className="mb-1 text-lg">
                        <i className="fa fa-commenting-o"></i>
                      </span>
                      <p className="font-medium text-[#000000] line-clamp-2 text-xs">
                        {converTime}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </ModalBox>
    </>
  );
};

export default VideoPopup;
