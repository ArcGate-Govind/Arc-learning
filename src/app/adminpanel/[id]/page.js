"use client";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../../../constant";
import { LOADING_MESSAGE, USER_NOT_FOUND } from "../../../../message";
import { getaccessToken } from "@/utils/common";
import NotFound from "@/app/not-found";

const UserProfile = ({ params }) => {
  const [userinfo, setUserinfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCheckbox, setAllCheckbox] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const accessToken = getaccessToken();

  useEffect(() => {
    userDetailsInfo();
  }, []);

  const userDetailsInfo = async () => {
    const response = await fetch(`${API_URL}user/${params.id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const jsonData = await response.json();
    let userShowData;
    if (jsonData.code == 200 && jsonData.message == "success") {
      console.log("success");
      userShowData = jsonData.projects[0][0] ? jsonData.projects[0][0] : [];
      setLoading(false);
    } else {
      setShowErrorMessage(true);
      userShowData = [];
      setLoading(false);
    }
    setUserinfo(userShowData);
  };

  const handleReadCheckboxChange = (isChecked) => {
    if (userinfo) {
      const readPermission = { ...userinfo.permissions, read: isChecked };
      setUserinfo((prevUserinfo) => ({
        ...prevUserinfo,
        permissions: readPermission,
      }));
      if (
        readPermission.read &&
        readPermission.update &&
        readPermission.delete
      ) {
        setAllCheckbox(true);
      } else {
        setAllCheckbox(false);
      }
    }
  };

  const handleUpdateCheckboxChange = (isChecked) => {
    if (userinfo && userinfo.permissions) {
      const updatedPermission = { ...userinfo.permissions, update: isChecked };
      setUserinfo((prevUserinfo) => ({
        ...prevUserinfo,
        permissions: updatedPermission,
      }));
      if (
        updatedPermission.read &&
        updatedPermission.update &&
        updatedPermission.delete
      ) {
        setAllCheckbox(true);
      } else {
        setAllCheckbox(false);
      }
    }
  };

  const handleDeleteCheckboxChange = (isChecked) => {
    if (userinfo && userinfo.permissions) {
      const updatedPermission = { ...userinfo.permissions, delete: isChecked };
      setUserinfo((prevUserinfo) => ({
        ...prevUserinfo,
        permissions: updatedPermission,
      }));
      if (
        updatedPermission.read &&
        updatedPermission.update &&
        updatedPermission.delete
      ) {
        setAllCheckbox(true);
      } else {
        setAllCheckbox(false);
      }
    }
  };

  const handleCheckboxChange = (userinfoModel, permissionType, isChecked) => {
    const updatedPermission = {
      ...userinfoModel.permissions,
      [permissionType]: isChecked,
    };
    setUserinfo((prevUserinfo) => ({
      ...prevUserinfo,
      permissions: updatedPermission,
    }));
    if (
      updatedPermission.read &&
      updatedPermission.update &&
      updatedPermission.delete
    ) {
      setAllCheckbox(true);
    } else {
      setAllCheckbox(false);
    }
  };

  const handleSaveChanges = async () => {
    const updatedData = [userinfo];
    await fetch(`${API_URL}user/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedData),
    });
  };

  const clickAllCheckedBox = (isChecked) => {
    setAllCheckbox(isChecked);
    const updatedPermission = {
      delete: isChecked,
      update: isChecked,
      read: isChecked,
    };
    setUserinfo((prevUserinfo) => ({
      ...prevUserinfo,
      permissions: updatedPermission,
    }));
  };

  return loading ? (
    <p>{LOADING_MESSAGE}</p>
  ) : (
    <div className="container mx-auto p-4">
      {userinfo.length > 0 ||
        (userinfo.length != 0 && (
          <div className="lg:flex">
            <div className="w-full lg:w-1/5 bg-white p-4">
              <div className="bg-[#F5F5F5] mt-20">
                <p className="dot margin text-center">G</p>
                <h3 className="px-4 py-2">Employee: {userinfo.username}</h3>
                <h3 className="px-4 py-2">
                  Employee id: {userinfo.employee_id}
                </h3>
                <h3 className="px-4 py-2">Role: {userinfo.role}</h3>
                <h3 className="px-4 py-2">
                  Status: {userinfo.status === 1 ? "active" : "inactive"}
                </h3>
                <h3 className="px-4 py-2">Project: {userinfo.project}</h3>
              </div>
            </div>
            <div className="w-full lg:w-4/5 bg-white p-4">
              <div className="m-2 w-full lg:w-[75%] overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-[#E3F2FD] text-left">
                        <input
                          type="checkbox"
                          className="m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={allCheckbox}
                          onChange={(e) => clickAllCheckedBox(e.target.checked)}
                        />
                      </th>
                      <th className="px-6 py-3 bg-[#E3F2FD] text-left font-semibold">
                        Project Name
                      </th>
                      <th className="px-6 py-3 bg-[#E3F2FD] text-left">
                        Read
                        <input
                          type="checkbox"
                          className="m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={userinfo.permissions.read}
                          onChange={(e) =>
                            handleReadCheckboxChange(e.target.checked)
                          }
                        />
                      </th>
                      <th className="px-6 py-3 bg-[#E3F2FD] text-left">
                        Update
                        <input
                          type="checkbox"
                          className="form-checkbox m-2 h-4 w-4 text-indigo-600"
                          checked={userinfo.permissions.update}
                          onChange={(e) =>
                            handleUpdateCheckboxChange(e.target.checked)
                          }
                        />
                      </th>
                      <th className="px-6 py-3 bg-[#E3F2FD] text-left">
                        Delete
                        <input
                          type="checkbox"
                          className="form-checkbox m-2 h-4 w-4 text-indigo-600"
                          checked={userinfo.permissions.delete}
                          onChange={(e) =>
                            handleDeleteCheckboxChange(e.target.checked)
                          }
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <input
                          type="checkbox"
                          className="m-2 form-checkbox h-4 w-4 text-indigo-600"
                          onChange={(e) => clickAllCheckedBox(e.target.checked)}
                          checked={allCheckbox}
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        {userinfo.project}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <input
                          type="checkbox"
                          className=" m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={userinfo.permissions.read}
                          id={`readCheckBoxId${userinfo.user_id}`}
                          onChange={(e) =>
                            handleCheckboxChange(
                              userinfo,
                              `readCheckBoxId${userinfo.user_id}`,
                              userinfo.user_id,
                              "read",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <input
                          type="checkbox"
                          className=" m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={userinfo.permissions.update}
                          id={`updateCheckBoxId${userinfo.user_id}`}
                          onChange={(e) =>
                            handleCheckboxChange(
                              userinfo,
                              `updateCheckBoxId${userinfo.user_id}`,
                              userinfo.user_id,
                              "update",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap border-b border-gray-300">
                        <input
                          type="checkbox"
                          className=" m-2 form-checkbox h-4 w-4 text-indigo-600"
                          checked={userinfo.permissions.delete}
                          id={`deleteCheckBoxId${userinfo.user_id}`}
                          onChange={(e) =>
                            handleCheckboxChange(
                              userinfo,
                              `deleteCheckBoxId${userinfo.user_id}`,
                              userinfo.user_id,
                              "delete",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex justify-center lg:justify-end mt-6">
                  <button
                    className="mx-20 bg-[#466EA1] p-1 rounded-md text-white"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

      {showErrorMessage && <NotFound message={USER_NOT_FOUND} />}
    </div>
  );
};

export default UserProfile;
