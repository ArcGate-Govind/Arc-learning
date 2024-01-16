"use client";
import React, { useContext, useEffect, useState } from "react";
import PopupMessage from "@/components/popupMessage";
import { useRouter } from "next/navigation";
import { API_URL } from "../../constant";
import { getAccessToken, setProjectName } from "@/utils/common";
import { LOADING_MESSAGE } from "../../message";
import NotFound from "@/app/not-found";
import ResultPrePage from "./resultPrePage";
import { userDetailsContext } from "@/context/createContext";
import PopupModal from "./popupModal";
import Pagination from "./pagination";

// UserProfile component
const UserProfile = (params) => {
  // Context variables
  const { currentPageContext, selectedPerPageResultContext } =
    useContext(userDetailsContext);
  // Destructuring context values
  const [currentPage, setCurrentPage] = currentPageContext;
  const [selectedPerPageResult, setShowSelectedPerPageResult] =
    selectedPerPageResultContext;
  // State variables to manage data and component behavior
  const [data, setData] = useState([]);
  const [readPermissionAll, setReadPermissionAll] = useState(false);
  const [permissionAll, setPermissionAll] = useState(false);
  const [updatePermissionAll, setUpdatePermissionAll] = useState(false);
  const [deletePermissionAll, setDeletePermissionAll] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showPopupMessage, setShowPopupMessage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataNotFound, setDataNotFound] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Extract user details ID from params
  const userDetailsId = params.id.params.id;
  const accessToken = getAccessToken();
  const router = useRouter();

  // Fetch user profile data
  useEffect(() => {
    fetchData();
  }, [currentPage, selectedPerPageResult]);

  // Effect to update permission's status when data changes
  useEffect(() => {
    const allReadChecked =
      data.length > 0 && data.every((item) => item.permissions.read);
    setReadPermissionAll(allReadChecked);

    const allUpdateChecked =
      data.length > 0 && data.every((item) => item.permissions.update);
    setUpdatePermissionAll(allUpdateChecked);

    const allDeleteChecked =
      data.length > 0 && data.every((item) => item.permissions.delete);
    setDeletePermissionAll(allDeleteChecked);
    let allPermissionAll =
      allReadChecked && allDeleteChecked && allUpdateChecked;
    setPermissionAll(allPermissionAll);
  }, [data]);

  // Function to fetch user profile data
  async function fetchData() {
    const queryParams = [];

    queryParams.push(`page=${currentPage}`);
    queryParams.push(`page_size=${selectedPerPageResult}`);

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    const newUrl = `${window.location.pathname}${queryString}`;
    window.history.replaceState({}, "", newUrl);

    try {
      const response = await fetch(
        `${API_URL}user/${userDetailsId}/${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const responseData = await response?.json();
      if (responseData.code == 200) {
        setTotalPages(
          responseData.pagination ? responseData.pagination.total_pages : 2
        );
        if (responseData.projects && responseData.projects.length > 0) {
          setData(responseData.projects);
        } else {
          setDataNotFound(true);
        }
      } else {
        router.push("/adminpanel");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Function to navigate to project's dashboard
  const getProjectName = (project) => {
    setProjectName(project);
    router.push(`/dashboard/videocontainer`);
  };

  // Function to handle individual permission updates
  const handlePermissionUpdate = (index, field, value) => {
    const allReadChecked = [];
    data.map((item) => {
      allReadChecked.push(item.permissions.read);
    });
    if (field == "read" && allReadChecked[index] == true) {
      const updatedData = [...data];
      updatedData[index].permissions["delete"] = value;
      updatedData[index].permissions["update"] = value;
      updatedData[index].unsavedChanges = true;
      setData(updatedData);
      setUnsavedChanges(true);
    }
    if (field == "read") {
      const updatedData = [...data];
      updatedData[index].permissions[field] = value;
      updatedData[index].unsavedChanges = true;
      setData(updatedData);
      setUnsavedChanges(true);
    } else if (allReadChecked[index] == true) {
      const updatedData = [...data];
      updatedData[index].permissions[field] = value;
      updatedData[index].unsavedChanges = true;
      setData(updatedData);
      setUnsavedChanges(true);
    }
  };

  // Function to handle toggling all read permissions
  const handleToggleAllReadPermissions = () => {
    const allReadChecked = data.every((item) => item.permissions.read);
    if (allReadChecked == true) {
      const updatedData = data.map((user) => ({
        ...user,
        permissions: {
          ...user.permissions,
          read: false,
          delete: false,
          update: false,
        },
        unsavedChanges: true,
      }));
      setData(updatedData);
      setReadPermissionAll(!allReadChecked);
      setUnsavedChanges(true);
    } else {
      const updatedData = data.map((user) => ({
        ...user,
        permissions: {
          ...user.permissions,
          read: !allReadChecked,
        },
        unsavedChanges: true,
      }));
      setData(updatedData);
      setReadPermissionAll(!allReadChecked);
      setUnsavedChanges(true);
    }
  };

  // Function to handle toggling all update permissions
  const handleToggleAllUpdatePermissions = () => {
    const allUpdateChecked = data.every((item) => item.permissions.update);
    const allReadChecked = data.every((item) => item.permissions.read);
    if (allReadChecked == true) {
      const updatedData = data.map((user) => ({
        ...user,
        permissions: {
          ...user.permissions,
          update: !allUpdateChecked,
        },
        unsavedChanges: true,
      }));
      setData(updatedData);
      setUpdatePermissionAll(!allUpdateChecked);
      setUnsavedChanges(true);
    }
  };

  // Function to handle toggling all delete permissions
  const handleToggleAllDeletePermissions = () => {
    const allDeleteChecked = data.every((item) => item.permissions.delete);
    const allReadChecked = data.every((item) => item.permissions.read);
    if (allReadChecked == true) {
      const updatedData = data.map((user) => ({
        ...user,
        permissions: {
          ...user.permissions,
          delete: !allDeleteChecked,
        },
        unsavedChanges: true,
      }));
      setData(updatedData);
      setDeletePermissionAll(!allDeleteChecked);
      setUnsavedChanges(true);
    }
  };

  // Function to handle toggling all permissions
  const handleToggleAllPermissions = (permission) => {
    const updatedData = data.map((user) => ({
      ...user,
      permissions: {
        ...user.permissions,
        delete: permission,
        read: permission,
        update: permission,
      },
      unsavedChanges: true,
    }));
    setData(updatedData);
    setDeletePermissionAll(permission);
    setReadPermissionAll(permission);
    setUpdatePermissionAll(permission);
    setUnsavedChanges(true);
    setPermissionAll(permission);
  };

  // Function to handle toggling all permissions by row
  const handleToggleAllpermissionByrow = (permission, index) => {
    const updatedData = [...data];
    const user = updatedData[index];
    user.permissions.read = permission;
    user.permissions.update = permission;
    user.permissions.delete = permission;
    user.unsavedChanges = true;
    setData(updatedData);
    setUnsavedChanges(true);
  };

  // Function to handle saving all unsaved changes
  const handleAllSaveChanges = async () => {
    try {
      let updatedData = data.filter((user) => user.unsavedChanges);
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
        setUnsavedChanges(false);
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

  // Handle confirmation modal for changes
  const confirmModal = () => {
    setIsOpenModal(false);
    setIsConfirmModal(true);
    setUnsavedChanges(false);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Close modal (confirmation or general)
  const closeModal = () => {
    setIsOpenModal(false);
    setIsConfirmModal(false);
  };

  // Sort data alphabetically by project name
  const sortedData = data.sort((a, b) => {
    return a?.project.localeCompare(b?.project);
  });

  return (
    <>
      {dataNotFound ? (
        <NotFound />
      ) : (
        <>
          <div className="md:w-[90%] sm:tabel mt-10 ">
            {/* Results per page and Save Changes button */}
            {data.length > 0 && (
              <div className="w-[92%] my-4 flex justify-end ">
                <ResultPrePage
                  setShowSelectedPerPageResult={setShowSelectedPerPageResult}
                  selectedPerPageResult={selectedPerPageResult}
                  setCurrentPage={setCurrentPage}
                />
                <button
                  className={`text-[#fff] bg-[#466EA1] px-2 py-1 rounded-md md:text-lg uppercase hover:bg-[#1D2E3E] ${
                    !unsavedChanges
                      ? "cursor-not-allowed disabled:hover:bg-[#728daf] disabled"
                      : ""
                  }`}
                  disabled={!unsavedChanges}
                  onClick={handleAllSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            )}
            <div className="md:w-[90%] sm:tabel lg:flex lg:ml-auto md:flex md:ml-auto">
              <div className=" bg-[#F5F5F5] mt-2 h-48 md:w-[24%] w-full">
                {sortedData?.map((item, index) => {
                  return (
                    <div key={index}>
                      {index == 0 && (
                        <div className=" md:mt-6 lg:mt-6" key={item.user_id}>
                          <div className="flex items-center">
                            <h3 className="text-sm font-semibold md:text-base px-4 py-2">
                              Employee id:
                            </h3>
                            <p>{item?.employee_id}</p>
                          </div>
                          <div className="flex items-center ">
                            <h3 className="text-sm font-semibold md:text-base px-4 py-2">
                              Employee:
                            </h3>
                            <p>
                              {item?.full_name ? item?.full_name : "Emp-Name "}
                            </p>
                          </div>

                          <div className="flex items-center">
                            <h3 className="text-sm font-semibold md:text-base px-4 py-2">
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
                          checked={permissionAll}
                          onChange={(e) =>
                            handleToggleAllPermissions(event.target.checked)
                          }
                        />
                      </th>
                      <th className="text-sm w-44 md:text-base">
                        Project Name
                      </th>
                      <th className="md:w-52 text-sm md:text-base">Role</th>

                      <th className="w-36 h-12 text-center text-sm md:text-base">
                        <div className="flex items-center justify-center mr-2">
                          <span className="md:mr-2">Read</span>
                          <input
                            type="checkbox"
                            className="w-4 h-4 ml-1"
                            checked={readPermissionAll}
                            onChange={handleToggleAllReadPermissions}
                          />
                        </div>
                      </th>
                      <th className="w-36 h-12 text-center text-sm md:text-base">
                        <div className="flex items-center justify-center mr-2">
                          <span className="md:mr-2">Update</span>
                          <input
                            checked={
                              readPermissionAll ? updatePermissionAll : false
                            }
                            onChange={handleToggleAllUpdatePermissions}
                            type="checkbox"
                            className={`${
                              readPermissionAll ? "" : "cursor-not-allowed"
                            } w-4 h-4 ml-1`}
                          />
                        </div>
                      </th>
                      <th className="w-36 h-12 text-center text-sm md:text-base">
                        <div className="flex items-center justify-center">
                          <span className="md:mr-2">Delete</span>
                          <input
                            checked={
                              readPermissionAll ? deletePermissionAll : false
                            }
                            onChange={handleToggleAllDeletePermissions}
                            type="checkbox"
                            className={`${
                              readPermissionAll ? "" : "cursor-not-allowed"
                            } w-4 h-4 ml-1`}
                          />
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          data-testid="loading-row"
                          colSpan="8"
                          className="text-black-600 text-center font-semibold py-3"
                        >
                          {LOADING_MESSAGE}
                        </td>
                      </tr>
                    ) : (
                      sortedData?.map((item, index) => {
                        return (
                          <tr
                            className="border border-b-[#f5f5f5] border-t-0 border-r-0 border-l-0 "
                            key={index}
                          >
                            <td className="w-20 h-12 flex justify-center items-center">
                              <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={
                                  item.permissions.read &&
                                  item.permissions.update &&
                                  item.permissions.delete
                                }
                                onChange={(e) =>
                                  handleToggleAllpermissionByrow(
                                    event.target.checked,
                                    index
                                  )
                                }
                              />
                            </td>
                            <td className="text-center text-sm md:text-base md:w-40 h-12 md:px-5">
                              <div
                                onClick={() => getProjectName(item.project)}
                                className="cursor-pointer font-semibold hover:underline"
                              >
                                {item.project}
                              </div>
                            </td>
                            <td className="capitalize md:text-center md:w-48 h-12 md:px-5 text-sm md:text-base px-2">
                              {item.role}
                            </td>
                            <td className="w-36 h-12">
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4"
                                  checked={item.permissions.read}
                                  onChange={(e) =>
                                    handlePermissionUpdate(
                                      index,
                                      "read",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td className="w-36 h-12">
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  className={`${
                                    item.permissions.read
                                      ? ""
                                      : "cursor-not-allowed"
                                  } w-4 h-4`}
                                  checked={
                                    item.permissions.read
                                      ? item.permissions.update
                                      : false
                                  }
                                  onChange={(e) =>
                                    handlePermissionUpdate(
                                      index,
                                      "update",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td className="w-36 h-12">
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  className={`${
                                    item.permissions.read
                                      ? ""
                                      : "cursor-not-allowed"
                                  } w-4 h-4`}
                                  checked={
                                    item.permissions.read
                                      ? item.permissions.delete
                                      : false
                                  }
                                  onChange={(e) =>
                                    handlePermissionUpdate(
                                      index,
                                      "delete",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                {/* Pagination */}
                {data.length > 0 && totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    unsavedChanges={unsavedChanges}
                    isConfirmModal={isConfirmModal}
                    setIsOpenModal={setIsOpenModal}
                  />
                )}
              </div>
            </div>
            {isOpenModal && (
              <PopupModal confirmModal={confirmModal} closeModal={closeModal} />
            )}
            {showPopup && <PopupMessage showPopupMessage={showPopupMessage} />}
          </div>
        </>
      )}
    </>
  );
};

export default UserProfile;
