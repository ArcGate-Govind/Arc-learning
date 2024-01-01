"use client";

import React, { createRef, useEffect, useRef, useState } from "react";
import { LOADING_MESSAGE } from "../../message";
import ModalBox from "./modalBox";
import moment from "moment";
import { API_URL, Backend_Localhost_Path } from "../../constant";
import { getAccessToken } from "@/utils/common";
import Comment from "./comment";

const VideoPopup = ({ onClose, data }) => {
  const [dataParams, setDataParams] = useState([data]);
  const [videoSeen, setVideoSeen] = useState({});
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [likeData, setLikeData] = useState(1);
  const [showLike, setShowLike] = useState(false);
  const [showCommentMessage, setShowCommentMessage] = useState(false);
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

  const handleLikeUpdate = async (totalLike, projectId, isLiked) => {
    if (!isLiked && !showLike) {
      const response = await fetch(`${API_URL}dashboard/likes/${projectId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const json = await response.json();

      if (totalLike >= 0 && json.status == 200) {
        setLikeData(totalLike + 1);
        setShowLike(!isLiked);
      }
    }
  };

  const handleUpdateComment = (value) => {
    if (value) {
      setShowCommentMessage(false);
    } else {
      setShowCommentMessage(true);
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
                let converTime = moment(project.created).fromNow();
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

                    <div className="flex w-11/12 ">
                      <span
                        onClick={() =>
                          handleLikeUpdate(
                            project.total_likes,
                            project.id,
                            project.is_liked
                          )
                        }
                        className="mb-1 mr-8 sm:text-sm md:text-3xl"
                      >
                        <i
                          className={`${
                            showLike || project.is_liked
                              ? " fa fa-thumbs-up cursor-not-allowed"
                              : " fa fa-thumbs-o-up cursor-pointer"
                          }`}
                        ></i>
                      </span>
                      <p className="font-medium text-[#000000] line-clamp-2 sm:text-sm md:text-lg mr-8">
                        {showLike ? likeData : project.total_likes}
                      </p>

                      <span
                        onClick={() => handleUpdateComment(showCommentMessage)}
                        className="mb-1 sm:text-sm md:text-3xl"
                      >
                        <i className="fa fa-commenting-o cursor-pointer"></i>
                      </span>
                    </div>
                  </div>
                );
              })}
            {showCommentMessage && (
              <Comment onClose={() => setShowCommentMessage(false)} />
            )}
          </div>
        )}
      </ModalBox>
    </>
  );
};

export default VideoPopup;
