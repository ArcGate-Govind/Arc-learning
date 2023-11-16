"use client";
import React from "react";
import videoImg from "../../../image/video1.png";
import Image from "next/image";
import videoImg1 from "../../../image/VedoTestImg.png";
import like from "../../../image/Like.png";
import dislike from "../../../image/dislike.png";
import comment from "../../../image/comment1.png";
const VideoDetails = ({ params }) => {
  const projectDetails = [
    {
      image: videoImg1,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
    },
    {
      image: videoImg1,
      description:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
    },
    {
      image: videoImg1,
      description:
        " when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
    },
    {
      image: videoImg1,
      description:
        " when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
    },
    {
      image: videoImg1,
      description:
        " when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
    },
  ];
  return (
    <div className=" pt-2 m-auto mb-0 w-11/12 flex flex-wrap">
      <div className="w-3/4">
        <div className="m-auto mb-0 mt-5 justify-center items-center w-11/12">
          {/* <video
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            width={800}
            className="py-4"
            alt="videoImage"
            controls
          /> */}
          <Image
            src={videoImg}
            width={900}
            className="py-2 rounded-3xl"
            alt="videoImage"
          />
          <p className="font-medium text-[#000000b8] w-11/12 line-clamp-2 text-xs mb-1">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <div className="sm:flex">
            <div className="w-80">
              <p className=" font-medium text-[#000000f5]  line-clamp-2 text-xs">
                projectName
              </p>
            </div>
            <div className="sm:flex w-2/6 justify-between justify-center items-center">
              <Image
                className="mb-1 cursor-pointer"
                alt="like"
                width={20}
                src={like}
              />
              <p className=" font-medium text-[#000000f5]  line-clamp-2 text-xs">
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
              <p className=" font-medium text-[#000000f5]  line-clamp-2 text-xs">
                5 days ago
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-3/12">
        <div className="custom-scrollbar m-auto mb-0 w-3/4  flex flex-wrap justify-center items-center overflow-y-auto max-h-[600px]">
          {projectDetails.map((project, index) => {
            return (
              <div key={index} className="hover:scale-95">
                <div className="relative">
                  <Image
                    src={project.image}
                    width={150}
                    className="py-4 rounded-3xl"
                    alt="videoImage"
                  />
                </div>
                <p className="font-medium text-[#000000b8] w-3/5 line-clamp-2 text-xs mb-1">
                  {project.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
