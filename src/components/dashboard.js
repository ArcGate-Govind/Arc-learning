"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import UserProfile from "@/image/profile.png";
import { usePathname, useRouter } from "next/navigation";

const Dashboard = () => {
  const pathname = usePathname();

  const path = pathname.split("/dashboard/");
  const [selectedTab, setSelectedTab] = useState(path[1]);
  const router = useRouter();

  const selectedData = (data) => {
    if (data == "documents") {
      router.push("/dashboard/documents");
    } else if (data == "videocontainer") {
      router.push("/dashboard/videocontainer");
    } else if (data == "questionnaire") {
      router.push("/dashboard/questionnaire");
    }
    setSelectedTab(data);
  };

  return (
    <div>
      <div className="flex justify-between items-center bg-[#E3F2FD] my-3 mx-10 px-10">
        <div>
          <h1 className="text-4xl font-light">Welcome,</h1>
          <p className="text-lg">Username</p>
        </div>
        <div className="flex flex-col text-center">
          <h1 className="text-2xl font-bold">Project Name</h1>
          <p className="text-lg">Role</p>
        </div>
        <div>
          <Image src={UserProfile} alt="UserProfile" className="w-40" />
        </div>
      </div>

      <div className="flex justify-around mx-10 my-8">
        <div
          onClick={() => selectedData("videocontainer")}
          className={`${
            selectedTab == "videocontainer" ? "bg-[#466EA1] text-[#FFFFFF]" : ""
          } w-full text-center cursor-pointer border-r-2 border-[#466EA1] hover:bg-[#bbbbbc] hover:text-[#FFFFFF] py-3`}
        >
          <h1 className="text-2xl font-light">Videos</h1>
        </div>
        <div
          onClick={() => selectedData("questionnaire")}
          className={`${
            selectedTab == "questionnaire" ? "bg-[#466EA1] text-[#FFFFFF]" : ""
          } w-full text-center cursor-pointer border-r-2 border-[#466EA1] hover:bg-[#bbbbbc] hover:text-[#FFFFFF] py-3`}
        >
          <h1 className="text-2xl font-light">Questionnaire</h1>
        </div>
        <div
          onClick={() => selectedData("documents")}
          className={`${
            selectedTab == "documents" ? "bg-[#466EA1] text-[#FFFFFF]" : ""
          } w-full text-center cursor-pointer hover:bg-[#bbbbbc] hover:text-[#FFFFFF] py-3`}
        >
          <h1 className="text-2xl font-light">Documents</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
