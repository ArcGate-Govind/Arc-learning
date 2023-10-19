"use client";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../../../globals";
import { getaccessToken, removeUserSession } from "@/utils/common";
import { useRouter } from "next/navigation";

const UserProfile = ({ params }) => {
  const router = useRouter();

  const [userinfo, setUserinfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allcheckbox, setAllcheckbox] = useState(false);

  const accessToken = getaccessToken();

  useEffect(() => {
    userDetailsinfo();
  }, []);

  const userDetailsinfo = async () => {
    const response = await fetch(`${API_URL}user/${params.id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const jsonData = await response.json();
    1;
    let userShowData;
    if (jsonData.code == 200) {
      userShowData = jsonData.projects[0][0] ? jsonData.projects[0][0] : [];
      // Access the first project object
      setLoading(false);
    } else {
      removeUserSession();
      localStorage.removeItem("currentPage");
      router.push("/");
      userShowData = []; // Access the first project object
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
        setAllcheckbox(true);
      } else {
        setAllcheckbox(false);
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
        setAllcheckbox(true);
      } else {
        setAllcheckbox(false);
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
        setAllcheckbox(true);
      } else {
        setAllcheckbox(false);
      }
    }
  };

  const handleCheckboxChange = (
    userinfoModel,
    checkBoxId,
    projectId,
    permissionType,
    isChecked
  ) => {
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
      setAllcheckbox(true);
    } else {
      setAllcheckbox(false);
    }
  };

  const handleSaveChanges = async () => {
    const updatedData = [userinfo];
    const response = await fetch(`${API_URL}user/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedData),
    });

    try {
      if (response.ok) {
        console.log("Data updated successfully");
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clickallcheckedbox = (isChecked) => {
    setAllcheckbox(isChecked);
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
    <p>Loading</p>
  ) : (
    <div className="container mx-auto p-4">
      <div className="lg:flex">
        <div className="w-full lg:w-1/5 bg-white p-4">
          <div className="bg-[#F5F5F5] mt-20">
            <p className="dot margin text-center">G</p>
            <h3 className="px-4 py-2">Employee: {userinfo.username}</h3>
            <h3 className="px-4 py-2">Employee id: {userinfo.employee_id}</h3>
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
                      checked={allcheckbox}
                      onChange={(e) => clickallcheckedbox(e.target.checked)}
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
                      onChange={(e) => clickallcheckedbox(e.target.checked)}
                      checked={allcheckbox}
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
    </div>
  );
};

export default UserProfile;
