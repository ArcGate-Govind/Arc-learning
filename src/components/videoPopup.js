"use client";

import React, { useEffect, useState } from "react";
import { LOADING_MESSAGE } from "../../message";
import ModalBox from "./modalBox";
import { API_URL, Backend_Localhost_Path } from "../../constant";
import Comment from "./comment";
import { api } from "@/utils/helper";

const VideoPopup = ({ onClose, data }) => {
  // State to manage
  const [dataParams, setDataParams] = useState();
  const [loading, setLoading] = useState(true);
  const [likeData, setLikeData] = useState(1);
  const [showLike, setShowLike] = useState(false);
  const [showVideo, setShowVideo] = useState(null);
  const [showCommentMessage, setShowCommentMessage] = useState(false);

  // Fetch video data and initialize component on mount or when data changes
  useEffect(() => {
    fetchData();
  }, [data]);

  // Function to fetch video data from the server
  const fetchData = async () => {
    try {
      const response = await api.get(`${Backend_Localhost_Path}${data.file}`, {
        responseType: "blob", // Specify the response type as 'blob' for binary data
      });

      if (response.status === 200) {
        const videoBlob = response.data;
        const videoUrl = URL.createObjectURL(videoBlob);
        setShowVideo(videoUrl);
        setDataParams(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle like updates for the video
  const handleLikeUpdate = async (totalLike, projectId, isLiked) => {
    if (!isLiked && !showLike) {
      const response = await api.post(
        `${API_URL}dashboard/likes/${projectId}/`
      );
      if (totalLike >= 0 && response.status == 200) {
        setLikeData(totalLike + 1);
        setShowLike(true);
      }
    }
  };

  // Function to handle comment section visibility
  const handleUpdateComment = (value) => {
    if (value) {
      setShowCommentMessage(false);
    } else {
      setShowCommentMessage(true);
    }
  };

  // Render the video popup component
  return (
    <>
      <ModalBox onClose={onClose}>
        {loading ? (
          // Display loading message while fetching data
          <div className="text-black-600 text-center font-semibold py-3">
            {LOADING_MESSAGE}
          </div>
        ) : (
          <div className="m-auto mb-0 mt-2 w-full">
            {dataParams && (
              <div className="flex flex-col items-center justify-center mb-4">
                {/* Video player */}
                <video
                  className="py-4 px-4 w-full h-full mx-auto"
                  alt="videoImage"
                  controlsList="nodownload"
                  controls
                >
                  <source src={showVideo} type="video/mp4" />
                </video>
                <p className="font-medium text-[#000000] w-11/12 line-clamp-2 text-xs mb-1 ">
                  {data.id}____ {dataParams.description}
                </p>
                {/* Like and comment section */}
                <div className="flex w-11/12 ">
                  <span
                    data-testid="like-button"
                    onClick={() =>
                      handleLikeUpdate(
                        dataParams.total_likes,
                        dataParams.id,
                        dataParams.is_liked
                      )
                    }
                    className="mb-1 mr-8 sm:text-sm md:text-3xl"
                  >
                    <i
                      className={`${
                        showLike || dataParams.is_liked
                          ? " fa fa-thumbs-up cursor-not-allowed"
                          : " fa fa-thumbs-o-up cursor-pointer"
                      }`}
                    ></i>
                  </span>
                  <p className="font-medium text-[#000000] line-clamp-2 sm:text-sm md:text-lg mr-8">
                    {showLike ? likeData : dataParams.total_likes}
                  </p>

                  <span
                    onClick={() => handleUpdateComment(showCommentMessage)}
                    className="mb-1 sm:text-sm md:text-3xl"
                  >
                    <i className="fa fa-commenting-o cursor-pointer"></i>
                  </span>
                </div>
              </div>
            )}
            {/* Display comment section if showCommentMessage is true */}
            {showCommentMessage && (
              <Comment
                videoId={dataParams.id}
                onClose={() => setShowCommentMessage(false)}
              />
            )}
          </div>
        )}
      </ModalBox>
    </>
  );
};

export default VideoPopup;
