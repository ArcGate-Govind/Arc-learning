"use client";
import React from "react";
import Image from "next/image";
import questionnaireLogo from "@/image/questionnaire.png";

const Questionnaire = () => {
  return (
    <div className="mx-5 md:mx-10 my-10 bg-[#F8F8F8] p-4 md:p-10">
      <div className="flex justify-center gap-x-3 mb-8">
        <input
          type="text"
          className="w-1/2 md:w-1/4 rounded px-5 border-2 border-gray-200"
          placeholder="Search"
        />
        <button
          type="button"
          className="p-2 bg-[#466EA1] text-[#FFFFFF] rounded cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
        >
          Search
        </button>
        <button
          type="button"
          className="p-2 bg-[#466EA1] text-[#FFFFFF] rounded cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
        >
          Clear
        </button>
      </div>
      <div className="flex justify-around space-x-2">
        <div className="bg-[#FFFFFF] p-3 cursor-pointer hover:shadow-lg">
          <Image
            src={questionnaireLogo}
            alt="LogoutImage"
            className="w-16 md:w-28 mx-auto"
          />
          <h2 className="text-center font-semibold p-1 md:p-3 text-sm md:text-lg">
            Assessment-1
          </h2>
        </div>
        <div className="bg-[#FFFFFF] p-3 cursor-pointer hover:shadow-lg">
          <Image
            src={questionnaireLogo}
            alt="LogoutImage"
            className="w-16 md:w-28 mx-auto"
          />
          <h2 className="text-center font-semibold p-1 md:p-3 text-sm md:text-lg">
            Assessment-2
          </h2>
        </div>
        <div className="bg-[#FFFFFF] p-3 cursor-pointer hover:shadow-lg">
          <Image
            src={questionnaireLogo}
            alt="LogoutImage"
            className="w-16 md:w-28 mx-auto"
          />
          <h2 className="text-center font-semibold p-1 md:p-3 text-sm md:text-lg">
            Assessment-3
          </h2>
        </div>
        <div className="bg-[#FFFFFF] p-3 cursor-pointer hover:shadow-lg">
          <Image
            src={questionnaireLogo}
            alt="LogoutImage"
            className="w-16 md:w-28 mx-auto"
          />
          <h2 className="text-center font-semibold p-1 md:p-3 text-sm md:text-lg">
            Assessment-4
          </h2>
        </div>
        <div className="bg-[#FFFFFF] p-3 cursor-pointer hover:shadow-lg">
          <Image
            src={questionnaireLogo}
            alt="LogoutImage"
            className="w-16 md:w-28 mx-auto"
          />
          <h2 className="text-center font-semibold p-1 md:p-3 text-sm md:text-lg">
            Assessment-5
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
