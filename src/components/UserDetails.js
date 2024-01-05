"use client";
import React, { useEffect, useState } from "react";
import PopupMessage from "@/components/popupMessage";
import { useRouter } from "next/navigation";
import { API_URL } from "../../constant";
import { getAccessToken, setProjectName } from "@/utils/common";

const UserDetails = (id) => {
    console.log("id",id?.id?.params.id);
  const [userInfo, setUserInfo] = useState([]);
  const [checkedAllRead, setCheckedAllRead] = useState(false);
  const [checkedAllUpdate, setCheckedAllUpdate] = useState(false);
  const [checkedAllDelete, setCheckedAllDelete] = useState(false);
  const [projectAllPermissions, setProjectAllPermissions] = useState([]);
  const [allCheckbox, setAllCheckbox] = useState(false);
  const [showPopupMessage, setShowPopupMessage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const accessToken = getAccessToken();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}user/${id?.id?.params.id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response?.json();
        if (data.code == 200) {
          setUserInfo(data);
          handleDefaultPermissions(data);
        } else {
          router.push("/adminpanel");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, []);

  const handleDefaultPermissions = (userInfo) => {
    let allRead = true;
    let allUpdate = true;
    let allDelete = true;
    let projectAllPermissions = [];
    userInfo?.projects?.map((project) => {
      if (
        project.permissions["read"] &&
        project.permissions["update"] &&
        project.permissions["delete"]
      ) {
        projectAllPermissions.push(true);
      } else {
        projectAllPermissions.push(false);
      }

      if (!project.permissions["read"]) {
        allRead = false;
      }
      if (!project.permissions["update"]) {
        allUpdate = false;
      }
      if (!project.permissions["delete"]) {
        allDelete = false;
      }
    });

    setProjectAllPermissions(projectAllPermissions);

    if (allRead) {
      setCheckedAllRead(allRead);
    }
    if (allUpdate) {
      setCheckedAllUpdate(allUpdate);
    }
    if (allDelete) {
      setAllCheckbox(allDelete);
    }
  };

  const handlePermissionChange = (projectIndex, permissionType) => {
    const updatedData = { ...userInfo };
    const project = updatedData.projects[projectIndex];
    project.permissions[permissionType] = !project.permissions[permissionType];
    if (
      project.permissions["read"] &&
      project.permissions["update"] &&
      project.permissions["delete"]
    ) {
      let updatedAllPermissions = [...projectAllPermissions];
      updatedAllPermissions[projectIndex] = true;
      setProjectAllPermissions(updatedAllPermissions);
    } else {
      let updatedAllPermissions = [...projectAllPermissions];
      updatedAllPermissions[projectIndex] = false;
      setProjectAllPermissions(updatedAllPermissions);
    }

    setUserInfo(updatedData);
    let allRead = true;
    let allUpdate = true;
    let allDelete = true;
    userInfo?.projects?.map((project) => {
      if (!project.permissions[permissionType]) {
        switch (permissionType) {
          case "read":
            allRead = false;
            break;

          case "update":
            allUpdate = false;
            break;

          case "delete":
            allDelete = false;
            break;
        }
      }
    });
    switch (permissionType) {
      case "read":
        setCheckedAllRead(allRead);
        break;

      case "update":
        setCheckedAllUpdate(allUpdate);
        break;

      case "delete":
        setCheckedAllDelete(allDelete);
        break;
    }
    if (!checkedAllRead || !checkedAllUpdate || !checkedAllDelete) {
      setAllCheckbox(false);
    } else {
      setAllCheckbox(true);
    }
  };

  const handleAllPermissionsByType = (permissionType, checkboxValues) => {
    let projectPermission = [];
    userInfo?.projects?.map((project, index) => {
      const updatedProject = { ...project };
      updatedProject.permissions[permissionType] = !checkboxValues;
      if (
        project.permissions["read"] &&
        project.permissions["update"] &&
        project.permissions["delete"]
      ) {
        projectPermission.push(true);
      } else {
        projectPermission.push(false);
      }
    });
    setProjectAllPermissions(projectPermission);
    switch (permissionType) {
      case "read":
        setCheckedAllRead(!checkedAllRead);
        break;

      case "update":
        setCheckedAllUpdate(!checkedAllUpdate);
        break;

      case "delete":
        setCheckedAllDelete(!checkedAllDelete);
        break;
    }
    if (!checkedAllRead || !checkedAllUpdate || !checkedAllDelete) {
      setAllCheckbox(false);
    } else {
      setAllCheckbox(true);
    }
  };
  const handleProjects = (index) => {
    const updatedData = { ...userInfo };
    const project = updatedData.projects[index];

    let updatedAllPermissions = [...projectAllPermissions];
    updatedAllPermissions[index] = !updatedAllPermissions[index];
    setProjectAllPermissions(updatedAllPermissions);
    project.permissions["read"] = updatedAllPermissions[index];
    project.permissions["update"] = updatedAllPermissions[index];
    project.permissions["delete"] = updatedAllPermissions[index];
    setUserInfo(updatedData);
    let allRead = true;
    let allUpdate = true;
    let allDelete = true;
    let allCheckbox = true;

    userInfo?.projects?.map((project) => {
      if (!project.permissions["read"]) {
        allRead = false;
        allCheckbox = false;
      }
      if (!project.permissions["update"]) {
        allUpdate = false;
        allCheckbox = false;
      }
      if (!project.permissions["delete"]) {
        allDelete = false;
        allCheckbox = false;
      }
    });

    setCheckedAllRead(allRead);
    setCheckedAllUpdate(allUpdate);
    setCheckedAllDelete(allDelete);
    if (!allRead || !allUpdate || !allDelete) {
      setAllCheckbox(false);
    } else {
      setAllCheckbox(true);
    }
  };
  const handleAllSaveChanges = async () => {
    try {
      const updatedData = userInfo.projects;

      const response = await fetch(`${API_URL}user/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(updatedData),
      });
      const json = await response.json();
      if (json.code == 200) {
        setShowPopupMessage(json.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1000);
      } else {
        setShowPopupMessage(response.statusText);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1000);
      }

      if (!response.ok) {
        console.error(
          "Error updating user data:",
          response.status,
          response.statusText
        );
        return;
      }
    } catch (error) {
      console.error("An error occurred while updating user data:", error);
    }
  };

  const handleSelectAll = () => {
    setAllCheckbox(!allCheckbox);
    let projectPermission = [];
    userInfo?.projects?.map((project, index) => {
      const updatedProject = { ...project };
      updatedProject.permissions["read"] = !allCheckbox;
      updatedProject.permissions["update"] = !allCheckbox;
      updatedProject.permissions["delete"] = !allCheckbox;
      projectPermission.push(!allCheckbox);
    });
    setProjectAllPermissions(projectPermission);
    setCheckedAllRead(!allCheckbox);
    setCheckedAllUpdate(!allCheckbox);
    setCheckedAllDelete(!allCheckbox);
  };

  const getProjectName = (project) => {
    setProjectName(project);
    router.push(`/dashboard/videocontainer`);
  };

  return (
    <div className="md:w-[90%] sm:tabel lg:flex lg:ml-auto md:flex md:ml-auto mt-14 ">
      <div className=" bg-[#F5F5F5] mt-2 h-48 md:w-[24%] w-full">
        {userInfo?.projects?.map((item, index) => {
          return (
            <div key={index}>
              {index == 0 && (
                <div className=" md:mt-6 lg:mt-6" key={item.user_id}>
                  <div className="flex items-center">
                    <h3 className="text-sm font-semibold  md:text-base px-4 py-2">
                      Employee id:
                    </h3>
                    <p>{item?.employee_id}</p>
                  </div>
                  <div className="flex items-center ">
                    <h3 className="text-sm font-semibold  md:text-base px-4 py-2">
                      Employee:
                    </h3>
                    <p>{item?.full_name ? item?.full_name : "Emp-Name "}</p>
                  </div>

                  <div className="flex  items-center">
                    <h3 className="text-sm font-semibold  md:text-base px-4 py-2">
                      Status:
                    </h3>
                    <p>{item.status == true ? "Active" : "inactive"}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="m-2 w-full lg:w-[100%] overflow-x-auto">
        <table className="border-2 border-[#F5F5F5] shadow-lg">
          <thead>
            <tr className="bg-[#E3F2FD] h-12">
              <th className="mr-1 w-20 h-12 flex justify-center items-center ml-1">
                <input
                  type="checkbox"
                  data-testid="read-checkbox"
                  className="w-4 h-4"
                  checked={allCheckbox}
                  onChange={() => handleSelectAll()}
                />
              </th>
              <th className="text-sm w-44 md:text-base">Project Name</th>
              <th className="md:w-52 text-sm md:text-base">Role</th>

              <th className="w-36 h-12 text-center text-sm md:text-base">
                <div className="flex items-center justify-center mr-2">
                  <span className="md:mr-2">Read</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 ml-1"
                    checked={checkedAllRead}
                    onChange={() =>
                      handleAllPermissionsByType("read", checkedAllRead)
                    }
                  />
                </div>
              </th>
              <th className="w-36 h-12 text-center text-sm md:text-base">
                <div className="flex items-center justify-center mr-2">
                  <span className="md:mr-2">Update</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 ml-1"
                    checked={checkedAllUpdate}
                    onChange={() =>
                      handleAllPermissionsByType("update", checkedAllUpdate)
                    }
                  />
                </div>
              </th>
              <th className="w-36 h-12 text-center text-sm md:text-base">
                <div className="flex items-center justify-center">
                  <span className="md:mr-2">Delete</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 ml-1"
                    checked={checkedAllDelete}
                    onChange={() =>
                      handleAllPermissionsByType("delete", checkedAllDelete)
                    }
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {userInfo?.projects?.map((userData, index) => {
              return (
                <tr
                  className="border border-b-[#f5f5f5] border-t-0 border-r-0 border-l-0 "
                  key={index}
                >
                  <td className="w-20 h-12 flex justify-center items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={projectAllPermissions[index]}
                      onChange={() => handleProjects(index)}
                    />
                  </td>
                  <td className="text-center text-sm md:text-base md:w-40 h-12 md:px-5">
                    <div
                      onClick={() => getProjectName(userData.project)}
                      className="cursor-pointer font-semibold hover:underline"
                    >
                      {userData.project}
                    </div>
                  </td>
                  <td className="capitalize md:text-center md:w-48 h-12 md:px-5 text-sm md:text-base px-2">
                    {userData.role}
                  </td>
                  <td className="w-36 h-12">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={userData.permissions.read}
                        onChange={() => handlePermissionChange(index, "read")}
                      />
                    </div>
                  </td>
                  <td className="w-36 h-12">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={userData.permissions.update}
                        onChange={() => handlePermissionChange(index, "update")}
                      />
                    </div>
                  </td>
                  <td className="w-36 h-12">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={userData.permissions.delete}
                        onChange={() => handlePermissionChange(index, "delete")}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-center lg:justify-end mt-6">
          <button
            className="text-[#fff] bg-[#466EA1] px-2 py-1 rounded-md md:text-md uppercase my-4 mx-auto hover:bg-[#1D2E3E] disabled:cursor-not-allowed disabled:hover:bg-[#466EA1]"
            onClick={() => handleAllSaveChanges(1)}
          >
            Save Changes
          </button>
        </div>
      </div>

      {showPopup && <PopupMessage showPopupMessage={showPopupMessage} />}
    </div>
  );
};

export default UserDetails;
