"use client";
import React from "react";
import Image from "next/image";
import Previous from "@/image/left-arrow.png";
import Next from "@/image/next.png";

const Questions = () => {
  return (
    <div className="relative flex">
      <div className="flex flex-col items-center justify-center min-h-[55rem] w-full">
        <div className="bg-[#F8F8F8] md:w-1/2 md:mx-auto mx-5">
          <div>
            <h1 className="text-xl text-center pt-4">
              Q. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididun ?
            </h1>
            <h3 className="text-right mx-10 mt-3 mb-1">
              Select up to 3 options
            </h3>
            <div className="bg-[#F8F8F8] mx-auto mt-1 pb-5">
              <div className="flex justify-around items-center gap-10 mx-10 mt-1">
                <div className="bg-[#FFFFFF] py-3 px-3 w-1/2 rounded-lg">
                  <input
                    type="checkbox"
                    id="option1"
                    name="option1"
                    value="option1"
                  />
                  <label className="ml-4" htmlFor="option1">
                    Option A
                  </label>
                </div>
                <div className="bg-[#FFFFFF] py-3 px-3 w-1/2 rounded-lg">
                  <input
                    type="checkbox"
                    id="option2"
                    name="option2"
                    value="option2"
                  />
                  <label className="ml-4" htmlFor="option2">
                    Option B
                  </label>
                </div>
              </div>
              <div className="flex justify-around items-center gap-10 mx-10 mt-4">
                <div className="bg-[#FFFFFF] py-3 px-3 w-1/2 rounded-lg">
                  <input
                    type="checkbox"
                    id="option3"
                    name="option3"
                    value="option3"
                  />
                  <label className="ml-4" htmlFor="option3">
                    Option C
                  </label>
                </div>
                <div className="bg-[#FFFFFF] py-3 px-3 w-1/2 rounded-lg">
                  <input
                    type="checkbox"
                    id="option4"
                    name="option4"
                    value="option4"
                  />
                  <label className="ml-4" htmlFor="option4">
                    Option D
                  </label>
                </div>
              </div>
              <div className="flex justify-around items-center gap-10 mx-10 mt-4">
                <div className="bg-[#FFFFFF] py-3 px-3 w-1/2 rounded-lg">
                  <input
                    type="checkbox"
                    id="option5"
                    name="option5"
                    value="option5"
                  />
                  <label className="ml-4" htmlFor="option5">
                    Option E
                  </label>
                </div>
                <div className="bg-[#FFFFFF] py-3 px-3 w-1/2 rounded-lg">
                  <input
                    type="checkbox"
                    id="option6"
                    name="option6"
                    value="option6"
                  />
                  <label className="ml-4" htmlFor="option6">
                    Option F
                  </label>
                </div>
              </div>
              <div className="flex justify-around items-center gap-10 mx-10 mt-4">
                <div className="bg-[#FFFFFF] py-3 px-3 w-1/2 rounded-lg">
                  <input
                    type="checkbox"
                    id="option7"
                    name="option7"
                    value="option7"
                  />
                  <label className="ml-4" htmlFor="option7">
                    Option G
                  </label>
                </div>
                <div className="bg-[#FFFFFF] py-3 px-3 w-1/2 rounded-lg">
                  <input
                    type="checkbox"
                    id="option8"
                    name="option8"
                    value="option8"
                  />
                  <label className="ml-4" htmlFor="option8">
                    Option H
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#F8F8F8] flex justify-between items-center w-full md:w-1/2 p-4 mt-10">
          <button
            type="button"
            className="text-lg hover:text-[#466EA1] hover:underline flex items-center"
          >
            <Image src={Previous} alt="Previous" className="w-5" />
            Previous
          </button>
          <button
            type="button"
            className="bg-[#466EA1] text-[#FFFFFF] py-1 px-3 rounded-md border-0 hover:bg-[#F8F8F8] hover:text-[#466EA1] hover:border-2 hover:border-[#466EA1]"
          >
            Submit
          </button>
          <button
            type="button"
            className="text-lg hover:text-[#466EA1] hover:underline flex items-center"
          >
            Next
            <Image src={Next} alt="Next" className="w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questions;
