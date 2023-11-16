"use client";
import Sidebar from "@/components/sidebar";
import React from "react";
import { useState } from "react";
import videoImg from "../../image/VedoTestImg.png";
import Image from "next/image";
import Link from "next/link";
import ".././globals.css";
function VideoContainer() {
  const [selectedTab, setSelectedTab] = useState("All Projects");
  const projectDetails = [
    {
      image: videoImg,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
      projectName: "Project-Name 1",
      time: " 5 days ago",
    },
    {
      image: videoImg,
      description:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
      projectName: "Project-Name 2",
      time: " 3 days ago",
    },
    {
      image: videoImg,
      description:
        " when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
      projectName: "Project-Name 4",
      time: "4 days ago",
    },
    {
      image: videoImg,
      description:
        "a galleyof type and scrambled it to make a type specimen book",
      projectName: "Project-Name 5",
      time: "6 days ago",
    },
    {
      image: videoImg,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting a type specimen book",
      projectName: "Project-Name 7",
      time: "9 days ago",
    },
    {
      image: videoImg,
      description:
        "Lorem Ipsum is lllllllll lllllllll simply dummy text of the printing and typesetting a type specimen book",
      projectName: "Project-Name 89",
      time: "9 days ago",
    },
    {
      image: videoImg,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
      projectName: "Project-Name 1",
      time: " 5 days ago",
    },
    {
      image: videoImg,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
      projectName: "Project-Name 1",
      time: " 5 days ago",
    },
    {
      image: videoImg,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galleyof type and scrambled it to make a type specimen book",
      projectName: "Project-Name 1",
      time: " 5 days ago",
    },
  ];
  return (
    <>
      <div className="flex  overflow-y-hidden h-100vh">
        <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <div className="w-screen ">
          <form>
            <div className=" bg-[#f5f5f5] text-center">
              <div className="sm:flex justify-center items-center md:h-24">
                <div className="pt-5 md:p-5 md:flex gap-4 text-center md:text-left">
                  <input
                    type="text"
                    name="projectSearch"
                    className="w-44 sm:w-80  h-8 md:h-9 px-3 border-[#C5C6C8] border rounded-md mb-2 md:mb-0"
                    placeholder="Search"
                  />
                </div>
                <div className="text-center md:text-left mr-3 md:mr-0">
                  <button
                    className="text-[#fff] bg-[#466EA1] p-2 rounded-md md:text-lg uppercase mb-1 mx-auto md:ml-2 md:mb-0 hover:bg-[#1D2E3E]"
                    type="submit"
                  >
                    Search
                  </button>
                  <button
                    className="text-[#fff] bg-[#466EA1] p-2 rounded-md md:text-lg uppercase mb-3 mx-auto md:ml-2 md:mb-0 hover:bg-[#1D2E3E]"
                    type="submit"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </form>

          <div className="custom-scrollbar m-auto mb-0 w-5/6 overflow-y-auto max-h-[630px]  flex flex-wrap justify-center items-center ">
            {projectDetails.map((project, index) => {
              return (
                <div
                  key={index}
                  className="hover:scale-95 w-1/1 sm:w-1/3 relative"
                >
                  <Link href={`videocontainer/${index}`}>
                    <div className="relative">
                      <Image
                        src={project.image}
                        width={260}
                        className="py-4"
                        alt="videoImage"
                      />
                      {/* <video  className="py-4" width={260} src="https://www.w3schools.com/tags/movie.ogg" controls>
                    </video> */}
                      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-12 -translate-y-1/4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="48"
                          viewBox="0 0 48 48"
                          fill="white"
                        >
                          <path d="M16 10v28l22-14z" />
                        </svg>
                      </div> */}
                    </div>
                    <p className="font-medium text-[#000000b8] w-4/5 line-clamp-2 text-xs mb-1">
                      {project.description}
                    </p>
                    <div className="flex">
                      <p className="font-medium text-[#000000f5] w-4/5 line-clamp-2 text-xs">
                        {project.projectName}
                      </p>
                      <p className="font-medium text-[#000000f5] w-4/5 line-clamp-2 text-xs">
                        {project.time}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoContainer;
