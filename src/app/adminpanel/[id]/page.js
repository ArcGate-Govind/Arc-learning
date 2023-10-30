"use client";
import React, { useEffect, useState } from "react";
import PopupMessage from "@/components/popupMessage";
import { API_URL } from "../../../../constant";
import { LOADING_MESSAGE, USER_NOT_FOUND } from "../../../../message";
import { getaccessToken } from "@/utils/common";
import NotFound from "@/app/not-found";

const UserProfile = ({ params }) => {
  const [userinfo, setUserinfo] = useState([]);
  console.log(userinfo, "userinfo");

  const [checkedAllRead, setCheckedAllRead] = useState(false);
  const [checkedAllUpdate, setCheckedAllUpdate] = useState(false);
  const [checkedAllDelete, setCheckedAllDelete] = useState(false);
  const [projectAllPermissions, setProjectAllPermissions] = useState([]);
  const [allCheckbox, setAllCheckbox] = useState(false);
  const [showPopupMessage, setShowPopupMessage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  let accessToken = getaccessToken();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}user/${params.id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();

        setUserinfo(data);
        console.log(userinfo?.projects,"bbb");
        handledefultpermissions(data);
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, []);

  const handledefultpermissions = (data) => {
    let allread = true;
    let allupdate = true;
    let alldelete = true;
    let projectAllPermissions = [];
    data.projects.map((project) => {
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
        allread = false;
      }
      if (!project.permissions["update"]) {
        allupdate = false;
      }
      if (!project.permissions["delete"]) {
        alldelete = false;
      }
    });

    setProjectAllPermissions(projectAllPermissions);

    if (allread) {
      setCheckedAllRead(allread);
    }
    if (allupdate) {
      setCheckedAllUpdate(allupdate);
    }
    if (alldelete) {
      setAllCheckbox(alldelete);
    }
  };

  const handlePermissionChange = (projectIndex, permissionType) => {
    const updatedData = { ...userinfo };
    const project = updatedData.projects[projectIndex];
    project.permissions[permissionType] = !project.permissions[permissionType];
    if (
      project.permissions["read"] &&
      project.permissions["update"] &&
      project.permissions["delete"]
    ) {
      let updatedallPermississio = [...projectAllPermissions];
      updatedallPermississio[projectIndex] = true;
      setProjectAllPermissions(updatedallPermississio);
    } else {
      let updatedallPermississio = [...projectAllPermissions];
      updatedallPermississio[projectIndex] = false;
      setProjectAllPermissions(updatedallPermississio);
    }

    setUserinfo(updatedData);
    let allread = true;
    let allupdate = true;
    let alldelete = true;
    userinfo.projects.map((project) => {
      if (!project.permissions[permissionType]) {
        switch (permissionType) {
          case "read":
            allread = false;

            break;

          case "update":
            allupdate = false;

            break;

          case "delete":
            alldelete = false;

            break;
        }
      }
    });
    switch (permissionType) {
      case "read":
        setCheckedAllRead(allread);

        break;

      case "update":
        setCheckedAllUpdate(allupdate);
        break;

      case "delete":
        setCheckedAllDelete(alldelete);
        break;
    }
    if (!checkedAllRead || !checkedAllUpdate || !checkedAllDelete) {
      setAllCheckbox(false);
    } else {
      setAllCheckbox(true);
    }
  };

  const handleallPermissionsByType = (permissionType, checkboxvalues) => {
    let projectPermission = [];
    userinfo.projects.map((project, index) => {
      const updatedProject = { ...project };
      updatedProject.permissions[permissionType] = !checkboxvalues;
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
  const handleprojects = (index) => {
    const updatedData = { ...userinfo };
    const project = updatedData.projects[index];

    let updatedallPermississio = [...projectAllPermissions];
    updatedallPermississio[index] = !updatedallPermississio[index];
    setProjectAllPermissions(updatedallPermississio);
    project.permissions["read"] = updatedallPermississio[index];
    project.permissions["update"] = updatedallPermississio[index];
    project.permissions["delete"] = updatedallPermississio[index];
    setUserinfo(updatedData);
    let allRead = true;
    let allUpdate = true;
    let allDelete = true;
  ;

    userinfo.projects.map((project) => {
      let allcheckbox = true
      if (!project.permissions["read"]) {
        allRead = false;
        allcheckbox = false;
      }
      if (!project.permissions["update"]) {
        allUpdate = false;
        allcheckbox = false;
      }
      if (!project.permissions["delete"]) {
        allDelete = false;
        allcheckbox = false;
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
      const updatedData = userinfo.projects;
      console.log(updatedData, "updatadata");

      const response = await fetch(`${API_URL}user/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(updatedData),
      });
      const json = await response.json();
      console.log(json, "json");
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

  const handleSaveChanges = async (index) => {
    try {
      const updatedData = userinfo.projects[index];
      const singleUpdateData = [];
      singleUpdateData.push(updatedData);
      console.log(updatedData, "updatadata");

      const response = await fetch(`${API_URL}user/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(singleUpdateData),
      });
      const json = await response.json();
      console.log(json, "json");
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
    userinfo.projects.map((project, index) => {
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
      <div className="lg:flex w-[100%]">
        <div className="w-full lg:w-[15%] bg-white p-4">
        {
          userinfo?.projects?.map((item)=>{
            return(
              <>
              <div className="bg-[#F5F5F5] mt-20">
              <p className="dot margin text-center">G</p>
              <h3 className="px-4 py-2">Employee:{item?.full_name} </h3>
              <h3 className="px-4 py-2">Employee id:{item?.employee_id}</h3>
            </div>
              </>
            )
          })
        }
          
        </div>
        <div className="w-full lg:w-4/5 bg-white p-4">
          <div className="m-2 w-full lg:w-[100%] overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-[#E3F2FD] text-left">
                    <input
                      type="checkbox"
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
                        handleallPermissionsByType("read", checkedAllRead)
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
                        handleallPermissionsByType("update", checkedAllUpdate)
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
                        handleallPermissionsByType("delete", checkedAllDelete)
                      }
                    />
                  </th>
                  <th className="px-6 py-3 bg-[#E3F2FD] text-left font-semibold">
                    Save Changes
                  </th>
                </tr>
              </thead>
              <tbody>
                {userinfo?.projects?.map((userdata, index) => {
                  return (
                    <tr key={index}>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <input
                          type="checkbox"
                          className="m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={projectAllPermissions[index]}
                          onChange={() => handleprojects(index)}
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        {userdata.project}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        {userdata.role}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <input
                          type="checkbox"
                          className=" m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={userdata.permissions.read}
                          onChange={() => handlePermissionChange(index, "read")}
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <input
                          type="checkbox"
                          className=" m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={userdata.permissions.update}
                          onChange={() =>
                            handlePermissionChange(index, "update")
                          }
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <input
                          type="checkbox"
                          className=" m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={userdata.permissions.delete}
                          onChange={() =>
                            handlePermissionChange(index, "delete")
                          }
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <button
                          className="mx-20 bg-[#466EA1] p-1 rounded-md text-white"
                          onClick={() => {
                            handleSaveChanges(index);
                          }}
                        >
                          Save Changes
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center lg:justify-end mt-6">
              <button
                className="mx-20 bg-[#466EA1] p-1 rounded-md text-white"
                onClick={handleAllSaveChanges}
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
