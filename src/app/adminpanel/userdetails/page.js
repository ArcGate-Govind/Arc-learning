"use client";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../../../globals";

const UserProfile = () => {
  const [userinfo, setUserinfo] = useState(null);
  console.log(userinfo, "llls");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userDetailsinfo();
  }, []);

  const userDetailsinfo = () => {
    // fetch("http://127.0.0.1:8000/api/v1/user/data/1/")
    fetch(`${API_URL}user/data/1/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserinfo(data.project[0][0]); // Access the first project object
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleReadCheckboxChange = (isChecked) => {
    if (userinfo) {
      setUserinfo((prevUserinfo) => ({
        ...prevUserinfo,
        permission: {
          ...prevUserinfo.permission,
          read: isChecked,
        },
      }));
    }
  };

  const handleUpdateCheckboxChange = (isChecked) => {
    if (userinfo && userinfo.permission) {
      const updatedPermission = { ...userinfo.permission, update: isChecked };
      setUserinfo((prevUserinfo) => ({
        ...prevUserinfo,
        permission: updatedPermission,
      }));
    }
  };

  const handleDeleteCheckboxChange = (isChecked) => {
    if (userinfo && userinfo.permission) {
      const updatedPermission = { ...userinfo.permission, delete: isChecked };
      setUserinfo((prevUserinfo) => ({
        ...prevUserinfo,
        permission: updatedPermission,
      }));
    }
  };

  const handleCheckboxChange = (
    userinfoModel,
    checkBoxId,
    projectId,
    permissionType,
    isChecked
  ) => {
    console.log(
      "userinfoModel",
      userinfoModel,
      "checkBoxId",
      checkBoxId,
      "projectId",
      projectId,
      "permissionType",
      permissionType,
      "isChecked",
      isChecked,
      "55"
    );

    const updatedPermission = {
      ...userinfoModel.permission,
      [permissionType]: isChecked,
    };
    setUserinfo((prevUserinfo) => ({
      ...prevUserinfo,
      permission: updatedPermission,
    }));
    //setUserinfo({ ...userinfoModel }); // Create a new object to trigger a re-render
  };

  const handleSaveChanges = () => {
    if (userinfo) {
      fetch("http://127.0.0.1:8000/api/v1/user/update/permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userinfo),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Permissions updated:", data);
        })
        .catch((error) => {
          console.error("Error updating permissions:", error);
        });
    }
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
            <h3 className="px-4 py-2">Employee id: {userinfo.user_id}</h3>
            <h3 className="px-4 py-2">Email: {userinfo.email}</h3>
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
                  <th className="px-4 py-2 bg-[#E3F2FD] text-left font-semibold">
                    Project Name
                  </th>
                  <th className="px-6 py-3 bg-[#E3F2FD] text-left">
                    Read
                    <input
                      type="checkbox"
                      className="m-2 form-checkbox h-4 w-4 text-indigo-600"
                      checked={userinfo.permission.read}
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
                      checked={userinfo.permission.update}
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
                      checked={userinfo.permission.delete}
                      onChange={(e) =>
                        handleDeleteCheckboxChange(e.target.checked)
                      }
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                    {userinfo.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600"
                      checked={userinfo.permission.read}
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
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600"
                      checked={userinfo.permission.update}
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
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600"
                      checked={userinfo.permission.delete}
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
