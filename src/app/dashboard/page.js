import React from "react";
import Image from "next/image";
import UserProfile from "@/image/profile.png";

const page = () => {
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

      <div className="flex justify-around mx-10">
        <div className="w-full text-center border-r-2 border-[#466EA1] cursor-pointer hover:bg-[#466EA1] hover:text-[#FFFFFF] py-3">
          <h1 className="text-2xl font-light">Videos</h1>
        </div>
        <div className="w-full text-center border-r-2 border-[#466EA1] cursor-pointer hover:bg-[#466EA1] hover:text-[#FFFFFF] py-3">
          <h1 className="text-2xl font-light">Questionnaire</h1>
        </div>
        <div className="w-full text-center cursor-pointer hover:bg-[#466EA1] hover:text-[#FFFFFF] py-3">
          <h1 className="text-2xl font-light">Documents</h1>
        </div>
      </div>
    </div>
  );
};

export default page;
