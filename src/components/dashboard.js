"use client";
import React, { useContext, useState } from "react";
import Image from "next/image";
import UserProfile from "@/image/profile.png";
import { usePathname, useRouter } from "next/navigation";
import VideoUploadForm from "./videoUploadForm";
import QuestionnaireUploadForm from "./questionnaireUploadForm";
import { userDetailsContext } from "@/context/createContext";

const Dashboard = ({ dashboardData }) => {
  // Context variables
  const { selectedProjectContext } = useContext(userDetailsContext);

  // Destructuring context values
  const [selectedProject, setShowSelectedProject] = selectedProjectContext;
  const pathname = usePathname();
  const path = pathname.split("/dashboard/");

  // State to track the selected tab and popup visibility
  const [selectedTab, setSelectedTab] = useState(path[1]);
  const [openPopup, setOpenPopup] = useState(false);
  const router = useRouter();

  // Function to handle selecting different tabs
  const selectedData = (data) => {
    router.push(`/dashboard/${data}?project=${selectedProject}`);
    setSelectedTab(data);
  };

  // Function to close the upload popup
  const onClose = () => {
    setOpenPopup(false);
  };

  // JSX structure for the Dashboard component
  return (
    <div>
      <div className="flex justify-between items-center bg-[#E3F2FD] my-3 mx-10 px-10">
        <div>
          <h1 className="text-xl md:text-4xl font-light">Welcome,</h1>
          <p className="text-md md:text-lg uppercase">
            {dashboardData?.username}
          </p>
        </div>
        <div className="flex flex-col text-center">
          <h1 className="text-xl md:text-2xl font-bold">
            {dashboardData?.project}
          </h1>
          <p className="text-md md:text-lg">Role</p>
        </div>
        <div>
          <Image
            src={UserProfile}
            alt="UserProfile"
            className="w-24 md:w-40 py-2 md:py-0"
          />
        </div>
      </div>

      <div className="flex gap-x-6 mx-10 my-8">
        {/* Tab for Videos */}
        <div
          onClick={() => selectedData("videocontainer")}
          className={`${
            selectedTab == "videocontainer" ? "bg-[#466EA1] text-[#FFFFFF]" : ""
          } text-center cursor-pointer hover:bg-[#bbbbbc] hover:text-[#FFFFFF] shadow-xl rounded-xl p-1 md:p-2`}
        >
          <h1 className="text-lg md:text-2xl font-light">Videos</h1>
        </div>

        {/* Tab for Questionnaire */}
        <div
          onClick={() => selectedData("questionnaire")}
          className={`${
            selectedTab == "questionnaire" ? "bg-[#466EA1] text-[#FFFFFF]" : ""
          } text-center cursor-pointer hover:bg-[#bbbbbc] hover:text-[#FFFFFF] shadow-xl rounded-xl p-1 md:p-2`}
        >
          <h1 className="text-lg md:text-2xl font-light">Questionnaire</h1>
        </div>

        {/* Tab for Documents */}
        <div
          onClick={() => selectedData("documents")}
          className={`${
            selectedTab == "documents" ? "bg-[#466EA1] text-[#FFFFFF]" : ""
          } text-center cursor-pointer hover:bg-[#bbbbbc] hover:text-[#FFFFFF] shadow-xl rounded-xl p-1 md:p-2`}
        >
          <h1 className="text-lg md:text-2xl font-light">Documents</h1>
        </div>

        {/* Button to open the upload popup */}
        <div
          onClick={() => setOpenPopup(true)}
          className="text-center cursor-pointer hover:bg-[#466EA1] hover:text-[#FFFFFF] shadow-xl rounded-xl p-1 md:p-2 ml-auto"
        >
          <h1 className="text-lg md:text-2xl font-light">Upload</h1>
        </div>
      </div>

      {/* Render VideoUploadForm if the popup is open and the tab is 'videocontainer' */}
      {openPopup && path[1] == "videocontainer" && (
        <VideoUploadForm onClose={onClose} />
      )}

      {/* Render QuestionnaireUploadForm if the popup is open and the tab is 'questionnaire' */}
      {openPopup && path[1] == "questionnaire" && (
        <QuestionnaireUploadForm onClose={onClose} />
      )}
    </div>
  );
};

export default Dashboard;
