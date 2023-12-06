// import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LOADING_MESSAGE } from "../../message";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  // const searchParams = useSearchParams();
  // const selectedData = searchParams.get("project");
  // console.log("search", selectedData);

  const [selectedTabData, setSelectedTabData] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const storedSelectedTabData = localStorage.getItem("selectedTab");
    if (storedSelectedTabData) {
      setSelectedTabData(storedSelectedTabData);
    }
    setLoading(true);
  }, []);
  const handleTabClick = (tabId, index) => {
    // setSelectedTabData(true)
    setSelectedTabData((prevVideoSeen) => ({
      prevVideoSeen,
      [index]: true,
    }));
    setSelectedTab(tabId);
  };
  let arrProjectName = ["AllProjects", "Project1", "Project2", "Project3"];
  return (
    // <div className="height-100 w-32 sm:w-48 text-center bg-[#E7E3E3]  text-[#4a4949f0] font-bold ">
    //   <div className="pt-20 p-2"></div>
    //   {arrProjectName.map((projectName, index) => {
    //     return (
    //       <div
    //         key={index}
    //         // className={`hover:text-black  text-base p-2 cursor-pointer ${
    //         //   selectedTab == projectName ? "text-black" : ""
    //         // }`}
    //         className="hover:text-black text-base p-2 cursor-pointer text-black"
    //         onClick={() => handleTabClick(projectName)}
    //       >
    //         {projectName}
    //       </div>
    //     );
    //   })}
    // </div>

    <div className="height-100 w-32 sm:w-48 text-center bg-[#E7E3E3]  text-[#4a4949f0] font-bold ">
      <div className="pt-20 p-2"></div>
      {loading ? (
        arrProjectName.map((projectName, index) => {
          let selectedTabDataObj = Object.keys(selectedTabData).length;
          return selectedTabDataObj > 0 ? (
            <div
              key={index}
              className={`hover:text-black text-base p-2 cursor-pointer ${
                selectedTab == projectName ? "text-black" : ""
              }`}
              onClick={() => handleTabClick(projectName, index)}
            >
              {projectName}
            </div>
          ) : (
            <div
              key={index}
              className={`hover:text-black text-base p-2 cursor-pointer ${
                projectName == "AllProjects" ? "text-black" : ""
              }`}
              onClick={() => handleTabClick(projectName, index)}
            >
              {projectName}
            </div>
          );
        })
      ) : (
        <div className="text-black-600 text-center font-semibold py-3">
          {LOADING_MESSAGE}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
