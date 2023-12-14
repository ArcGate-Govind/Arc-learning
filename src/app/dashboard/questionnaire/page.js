"use client";
import React from "react";
import Image from "next/image";
import questionnaireLogo from "@/image/questionnaire.png";
import Link from "next/link";

const Questionnaire = () => {
  const questionnaireData = [
    { id: 1, title: "Assessment-1" },
    { id: 2, title: "Assessment-2" },
    { id: 3, title: "Assessment-3" },
    { id: 4, title: "Assessment-4" },
    { id: 5, title: "Assessment-5" },
  ];

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
        {questionnaireData.map((item) => (
          <Link href={`questionnaire/${item.id}`}>
            <div
              key={item.id}
              className="bg-[#FFFFFF] p-3 cursor-pointer hover:shadow-lg"
            >
              <Image
                src={questionnaireLogo}
                alt="LogoutImage"
                className="w-16 md:w-20 mx-auto pt-1"
              />
              <h2 className="text-center font-semibold p-1 text-sm md:text-lg">
                {item.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Questionnaire;
