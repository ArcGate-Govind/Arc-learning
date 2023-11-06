"use client";
import Sidebar from "@/components/sidebar";
import React from "react";
import { useState } from "react";
import videoImg from "../../image/VedoTestImg.png";
import Image from "next/image";
function VideoContainer() {
  const [selectedTab, setSelectedTab] = useState("All Projects");

  return (
    <>
      <div className="flex  min-h-screen">
        <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <div className="w-screen ">
          <div className=" bg-[#f5f5f5] text-center">
            <div className=" sm:flex justify-center items-center md:h-24">
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

          <div className="m-auto mb-0 sm:w-3/4 flex flex-wrap justify-center items-center ">
            <div className=" w-1/1 sm:w-1/3">
              <Image src={videoImg} width={260} className="py-4 rounded-3xl" />
              <p className="font-medium text-[#000000b8] w-4/5 line-clamp-2 text-xs mb-1">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
              <div className="flex">
                <p className=" font-medium text-[#000000f5] w-4/5 line-clamp-2 text-xs">
                  Project-Name
                </p>
                <p className=" font-medium text-[#000000f5] w-4/5 line-clamp-2 text-xs">
                  5 days ago
                </p>
              </div>
            </div>
            <div className="w-1/1 sm:w-1/3">
              <Image src={videoImg} width={260} className="py-4" />
              <p className="font-medium text-[#000000b8] w-4/5 line-clamp-2 text-xs mb-1">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
              <div className="flex">
                <p className=" font-medium text-[#000000f5] w-4/5 line-clamp-2 text-xs">
                  Project-Name
                </p>
                <p className=" font-medium text-[#000000f5] w-4/5 line-clamp-2 text-xs">
                  5 days ago
                </p>
              </div>
            </div>
            <div className="w-1/1  sm:w-1/3">
              <Image src={videoImg} width={260} className="py-4" />
              <p className="font-medium text-[#000000b8] w-4/5 line-clamp-2 text-xs mb-1">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
              <div className="flex">
                <p className=" font-medium text-[#000000f5] w-4/5 line-clamp-2 text-xs">
                  Project-Name
                </p>
                <p className=" font-medium text-[#000000f5] w-4/5 line-clamp-2 text-xs">
                  5 days ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoContainer;
