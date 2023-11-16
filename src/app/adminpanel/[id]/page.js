"use client";
import React, { useEffect, useState } from "react";
import PopupMessage from "@/components/popupMessage";
import { useRouter } from "next/navigation";
import { API_URL } from "../../../../constant";
import { getAccessToken } from "@/utils/common";
const UserProfile = ({ params }) => {
  const [userInfo, setUserInfo] = useState([]);
  const [checkedAllRead, setCheckedAllRead] = useState(false);
  const [checkedAllUpdate, setCheckedAllUpdate] = useState(false);
  const [checkedAllDelete, setCheckedAllDelete] = useState(false);
  const [projectAllPermissions, setProjectAllPermissions] = useState([]);
  const [allCheckbox, setAllCheckbox] = useState(false);
  const [showPopupMessage, setShowPopupMessage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  let accessToken = getAccessToken();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}user/${params.id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response?.json();
        setUserInfo(data);
        handleDefaultPermissions(data);
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

  return (
    <div className="container mx-auto p-4 w-[100%]">
      <button
        className="border px-6 py-2 bg-[#E3F2FD] "
        onClick={() => {
          router.push("/adminpanel", { scroll: false });
        }}
      >
        Back
      </button>
      <div className="lg:flex w-[100%]">
        <div className="w-full lg:w-[15%] bg-white p-4">
          {userInfo?.projects?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <div
                  className={
                    index == 0
                      ? "bg-[#F5F5F5] mt-20"
                      : 'hidden "bg-[#F5F5F5] mt-20'
                  }
                  key={item.user_id}
                >
                  <h3 className="px-4 py-2" key={index}>
                    Employee:{item?.full_name}{" "}
                  </h3>
                  <h3 className="px-4 py-2">Employee id:{item?.employee_id}</h3>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="w-full lg:w-4/5 bg-white p-4">
          <div className="m-2 w-full lg:w-[100%] overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-[#E3F2FD] text-left">
                    <input
                      type="checkbox"
                      data-testid="read-checkbox"
                      className="m-2 form-checkbox h-4 w-4 text-indigo-600"
                      checked={allCheckbox}
                      onChange={() => handleSelectAll()}
                    />
                  </th>
                  <th className="px-6 py-3 bg-[#E3F2FD] text-left font-semibold">
                    Project Name
                  </th>
                  <th className="px-6 py-3 bg-[#E3F2FD] text-left font-semibold">
                    Role
                  </th>

                  <th className="px-6 py-3 bg-[#E3F2FD] text-left">
                    Read
                    <input
                      type="checkbox"
                      className="m-2 form-checkbox h-4 w-4 text-indigo-600"
                      checked={checkedAllRead}
                      onChange={() =>
                        handleAllPermissionsByType("read", checkedAllRead)
                      }
                    />
                  </th>
                  <th className="px-6 py-3 bg-[#E3F2FD] text-left">
                    Update
                    <input
                      type="checkbox"
                      className="form-checkbox m-2 h-4 w-4 text-indigo-600"
                      checked={checkedAllUpdate}
                      onChange={() =>
                        handleAllPermissionsByType("update", checkedAllUpdate)
                      }
                    />
                  </th>
                  <th className="px-6 py-3 bg-[#E3F2FD] text-left">
                    Delete
                    <input
                      type="checkbox"
                      className="form-checkbox m-2 h-4 w-4 text-indigo-600"
                      checked={checkedAllDelete}
                      onChange={() =>
                        handleAllPermissionsByType("delete", checkedAllDelete)
                      }
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {userInfo?.projects?.map((userData, index) => {
                  return (
                    <tr key={index}>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <input
                          type="checkbox"
                          className="m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={projectAllPermissions[index]}
                          onChange={() => handleProjects(index)}
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        {userData.project}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        {userData.role}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <input
                          type="checkbox"
                          className=" m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={userData.permissions.read}
                          onChange={() => handlePermissionChange(index, "read")}
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <input
                          type="checkbox"
                          className=" m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={userData.permissions.update}
                          onChange={() =>
                            handlePermissionChange(index, "update")
                          }
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <input
                          type="checkbox"
                          className=" m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={userData.permissions.delete}
                          onChange={() =>
                            handlePermissionChange(index, "delete")
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center lg:justify-end mt-6">
              <button
                className="mx-20 bg-[#466EA1] p-1 rounded-md text-white"
                onClick={() => handleAllSaveChanges(1)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPopup && <PopupMessage showPopupMessage={showPopupMessage} />}
    </div>
  );
};

export default UserProfile;
