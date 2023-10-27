"use client";
import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getaccessToken, removeUserSession } from "@/utils/common";
import { useRouter } from "next/navigation";
import {
  LOADING_MESSAGE,
  SEARCH_FIELD_MESSAGE,
  SEARCH_RESULT_MESSAGE,
} from "../../../message";
import { API_URL } from "../../../constant";
import Link from "next/link";
import { userDetailsContext } from "../../context/createContext";
import PopupModal from "@/components/popupModal";
import PopupMessage from "@/components/popupMessage";

const AdminPanel = () => {
  const [currentPage, setCurrentPage] = useContext(userDetailsContext);
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blankInputError, setBlankInputError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAllPermissionsMap, setSelectAllPermissionsMap] = useState({});
  const [cachedData, setCachedData] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(true);
  const [readPermissionAll, setReadPermissionAll] = useState(false);
  const [updatePermissionAll, setUpdatePermissionAll] = useState(false);
  const [deletePermissionAll, setDeletePermissionAll] = useState(false);
  const [showPopupMessage, setShowPopupMessage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  // const [seachValue, setSearchValue] = useState({});

  useEffect(() => {
    const initialSelectedUsers = data.map(() => false);
    setSelectedUsers(initialSelectedUsers);
    // let values = JSON.parse(localStorage.getItem("values"));
    // setSearchValue(
    //   values ? values : { employeeId: "fggg", employeeName: "", status: "" }
    // );
  }, []);

  useEffect(() => {
    fetchData();
    if (currentPage && !selectAllPermissionsMap[currentPage]) {
      setSelectAllPermissionsMap({
        ...selectAllPermissionsMap,
        [currentPage]: false,
      });
    }
  }, [currentPage]);
  const accessToken = getaccessToken();
  async function fetchData() {
    const currentURL = window.location.href;
    const queryStringUrl = currentURL.split("?")[1];

    try {
      setLoading(true);
      const queryParams = [];
      let values = JSON.parse(localStorage.getItem("values"));

      if (queryStringUrl == undefined) {
        localStorage.removeItem("values");
        // queryParams.push(`page=${currentPage}`);
      } else if (values != null) {
        if (values.employeeId || values.employeeName || values.status) {
          if (values.employeeId) {
            queryParams.push(`employee_id=${values.employeeId}`);
          }
          if (values.employeeName) {
            queryParams.push(`full_name=${values.employeeName}`);
          }
          if (values.status) {
            const statusText = values.status === "Active" ? "true" : "false";
            queryParams.push(`status=${statusText}`);
          }
        }
      }
      queryParams.push(`page=${currentPage}`);
      const queryString =
        queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
      const newUrl = `${window.location.pathname}${queryString}`;
      window.history.replaceState({}, "", newUrl);

      if (cachedData[queryString]) {
        setData(cachedData[queryString]);
        setLoading(false);
      } else {
        const response = await fetch(`${API_URL}users/${queryString}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        let authorizationData;
        console.log("json", json, values);
        if (json.code == 200) {
          authorizationData = json.results ? json.results : [];
          setCachedData({ ...cachedData, [queryString]: authorizationData });
          setLoading(false);
        } else {
          removeUserSession();
          localStorage.removeItem("currentPage");
          localStorage.removeItem("values");
          router.push("/");
          authorizationData = [];
        }
        setData(authorizationData);
        setTotalPages(json.pagination.total_pages);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handlePrevPage = () => {
    if (unsavedChanges) {
      setIsOpenModal(true);
    } else if (isConfirmModal && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (unsavedChanges) {
      setIsOpenModal(true);
    } else if (isConfirmModal && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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

  const closeModal = () => {
    setIsOpenModal(false);
    setIsConfirmModal(false);
  };

  const handleSaveChanges = async (user = null) => {
    setIsSaving(true);
    try {
      let updatedData;

      if (user) {
        if (Array.isArray(user)) {
          updatedData = user;
        } else {
          updatedData = [user];
        }
      } else {
        updatedData = data;
      }

      const response = await fetch(`${API_URL}user/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedData),
      });
      const json = await response.json();
      console.log("response", json);
      if (json.code == 200) {
        setUnsavedChanges(false);
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormSubmit = () => {
    if (
      !formik.values.employeeId &&
      !formik.values.employeeName &&
      !formik.values.status
    ) {
      setBlankInputError(true);
    } else {
      setBlankInputError(false);
      fetchData();
    }
  };

  const validationSchema = Yup.object()
    .shape({
      employeeId: Yup.string(),
      employeeName: Yup.string(),
      status: Yup.string(),
    })
    .test({ SEARCH_FIELD_MESSAGE }, function (values) {
      return !!values.employeeId || !!values.employeeName || !!values.status;
    });

  let searchValue = JSON.parse(localStorage.getItem("values"));
  if (searchValue == null) {
    searchValue = { employeeId: "", employeeName: "", status: "" };
  }

  const formik = useFormik({
    initialValues: {
      employeeId: searchValue.employeeId,
      employeeName: searchValue.employeeName,
      status: searchValue.status,
    },
    validationSchema,
    onSubmit: (values) => {
      localStorage.setItem("values", JSON.stringify(values));
      if (!values.employeeId && !values.employeeName && !values.status) {
        setBlankInputError(true);
      } else {
        setBlankInputError(false);
        const queryParams = [];
        if (values.employeeId)
          queryParams.push(`employee_id=${values.employeeId}`);
        if (values.employeeName)
          queryParams.push(`fullname=${values.employeeName}`);
        if (values.status) queryParams.push(`status=${values.status}`);
        fetchData();
      }
    },
  });

  const handlePermissionUpdate = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index].permissions[field] = value;
    setData(updatedData);
    setUnsavedChanges(true);
  };

  const handleToggleAllPermissions = () => {
    const allPermissionsTrue = data.every(
      (user) =>
        user.permissions.read &&
        user.permissions.update &&
        user.permissions.delete
    );

    const currentPageValue = !allPermissionsTrue;

    const updatedData = data.map((user) => ({
      ...user,
      permissions: {
        read: currentPageValue,
        update: currentPageValue,
        delete: currentPageValue,
      },
    }));

    const updatedSelectedUsers = updatedData.reduce(
      (users, user) => {
        users[user.user_id] = currentPageValue;
        return users;
      },
      { ...selectedUsers }
    );

    setSelectedUsers(updatedSelectedUsers);
    setData(updatedData);
    setUnsavedChanges(true);
    setSelectAllPermissionsMap({
      ...selectAllPermissionsMap,
      [currentPage]: currentPageValue,
    });
  };

  const handleToggleUserPermissions = (user_id, setToTrue) => {
    const updatedData = data.map((user) => {
      if (user.user_id === user_id) {
        return {
          ...user,
          permissions: {
            read: setToTrue,
            update: setToTrue,
            delete: setToTrue,
          },
        };
      }
      return user;
    });

    const updatedSelectedUsers = { ...selectedUsers };
    updatedSelectedUsers[user_id] = setToTrue;

    setData(updatedData);
    setSelectedUsers(updatedSelectedUsers);
    setUnsavedChanges(true);
  };

  const handleToggleAllReadPermissions = () => {
    const allReadChecked = data.every((item) => item.permissions.read);
    const updatedData = data.map((user) => ({
      ...user,
      permissions: {
        ...user.permissions,
        read: !allReadChecked,
      },
    }));
    setData(updatedData);
    setReadPermissionAll(!allReadChecked);
    setUnsavedChanges(true);
  };

  const handleToggleAllUpdatePermissions = () => {
    const allUpdateChecked = data.every((item) => item.permissions.update);
    const updatedData = data.map((user) => ({
      ...user,
      permissions: {
        ...user.permissions,
        update: !allUpdateChecked,
      },
    }));
    setData(updatedData);
    setUpdatePermissionAll(!allUpdateChecked);
    setUnsavedChanges(true);
  };

  const handleToggleAllDeletePermissions = () => {
    const allDeleteChecked = data.every((item) => item.permissions.delete);
    const updatedData = data.map((user) => ({
      ...user,
      permissions: {
        ...user.permissions,
        delete: !allDeleteChecked,
      },
    }));
    setData(updatedData);
    setDeletePermissionAll(!allDeleteChecked);
    setUnsavedChanges(true);
  };

  useEffect(() => {
    const allReadChecked = data.every((item) => item.permissions.read);
    setReadPermissionAll(allReadChecked);

    const allUpdateChecked = data.every((item) => item.permissions.update);
    setUpdatePermissionAll(allUpdateChecked);

    const allDeleteChecked = data.every((item) => item.permissions.delete);
    setDeletePermissionAll(allDeleteChecked);

    const allPermissionsTrue = data.every(
      (user) =>
        user.permissions.read &&
        user.permissions.update &&
        user.permissions.delete
    );

    // Check if all permissions are true in the database
    let allPermissionsAreTrue = true;
    for (const user of data) {
      if (
        !user.permissions.read ||
        !user.permissions.update ||
        !user.permissions.delete
      ) {
        allPermissionsAreTrue = false;
        break;
      }
    }

    if (allPermissionsTrue) {
      setSelectAllPermissionsMap((prevMap) => ({
        ...prevMap,
        [currentPage]: true,
      }));
    } else {
      // If not all permissions are true, set it to false
      setSelectAllPermissionsMap((prevMap) => ({
        ...prevMap,
        [currentPage]: false,
      }));
    }

    const usersWithAllPermissionsTrue = data
      .filter(
        (user) =>
          user.permissions.read &&
          user.permissions.update &&
          user.permissions.delete
      )
      .map((user) => user.user_id);

    const initialSelectedUsers = data.reduce((selected, user) => {
      selected[user.user_id] = usersWithAllPermissionsTrue.includes(
        user.user_id
      );
      return selected;
    }, {});

    setSelectedUsers(initialSelectedUsers);
  }, [data]);

  const handleUpdateStatus = (index, newStatus) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);
    setUnsavedChanges(true);
  };

  const getPageNumbers = (totalPages) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const sortedData = data.sort((a, b) => {
    const employeeIdA = parseInt(a.employee_id.replace("emp_", ""), 10);
    const employeeIdB = parseInt(b.employee_id.replace("emp_", ""), 10);
    return employeeIdA - employeeIdB;
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-[#f5f5f5] text-center">
          <div className="flex md:flex-row justify-center items-center md:h-24">
            <div className="pt-5 md:p-5 md:flex gap-4 text-center md:text-left">
              <input
                type="text"
                name="employeeId"
                className="md:w-64 h-8 md:h-9 px-3 border-[#C5C6C8] border rounded-md mb-2 md:mb-0"
                placeholder="Search by Employee Id"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.employeeId}
              />
              <input
                type="text"
                name="employeeName"
                className="md:w-64 h-8 md:h-9 px-3 border-[#C5C6C8] border rounded-md mb-2 ml-2 md:mb-0 md:ml-0"
                placeholder="Search by Employee Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.employeeName}
              />
              <select
                name="status"
                className="md:w-64 h-8 md:h-9 px-3 bg-[#fff] text-[#9CA4B4] border-[#C5C6C8] border rounded-md mb-2 ml-2 md:mb-0 md:ml-0"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.status}
                placeholder="Search by Employee Status"
              >
                <option value="" className="text-[#C5C6C8]">
                  Select Status
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="text-center md:text-left mr-3 md:mr-0">
              <button
                className="text-[#fff] bg-[#466EA1] p-2 rounded-md md:text-lg uppercase mb-3 mx-auto md:ml-2 md:mb-0 hover:bg-[#1D2E3E]"
                type="submit"
                onClick={handleFormSubmit}
              >
                Search
              </button>
            </div>
          </div>
          {blankInputError && (
            <div className="text-red-500 block pb-3 md:-mt-5">
              {SEARCH_FIELD_MESSAGE}
            </div>
          )}
        </div>
      </form>

      <div>
        <div className="table mx-auto md:mt-10 mt-5">
          <table className="border-2 border-[#F5F5F5] shadow-lg">
            <thead>
              <tr className="bg-[#E3F2FD] h-12">
                <th className="mr-1 md:w-20 h-12 flex justify-center items-center ml-1">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectAllPermissionsMap[currentPage]}
                    onChange={handleToggleAllPermissions}
                  />
                </th>
                <th className="text-sm md:w-44 md:text-base">Employee Id</th>
                <th className="md:w-52 text-sm md:text-base">Employee Name</th>
                <th className="md:w-44 text-sm md:text-base">Status</th>
                <th className="md:w-36 text-sm md:text-base">Role</th>
                <th className="md:w-36 h-12 text-center text-sm md:text-base">
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
                <th className="md:w-36 h-12 text-center text-sm md:text-base">
                  <div className="flex items-center justify-center mr-2">
                    <span className="md:mr-2">Update</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 ml-1"
                      checked={updatePermissionAll}
                      onChange={handleToggleAllUpdatePermissions}
                    />
                  </div>
                </th>
                <th className="md:w-36 h-12 text-center text-sm md:text-base">
                  <div className="flex items-center justify-center">
                    <span className="md:mr-2">Delete</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 ml-1"
                      checked={deletePermissionAll}
                      onChange={handleToggleAllDeletePermissions}
                    />
                  </div>
                </th>
                <th className="md:w-36">
                  <p>Save Changes</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-black-600 text-center font-semibold py-3"
                  >
                    {LOADING_MESSAGE}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-red-600 text-center py-3">
                    {SEARCH_RESULT_MESSAGE}
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="border border-b-[#f5f5f5] border-t-0 border-r-0 border-l-0"
                    >
                      <td className="md:w-20 h-12 flex justify-center items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedUsers[item.user_id]}
                          onChange={(e) =>
                            handleToggleUserPermissions(
                              item.user_id,
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td
                        className="text-center text-sm md:text-base md:w-40 h-12 md:px-5"
                        key={item.user_id}
                      >
                        <Link
                          href={`adminpanel/${item.user_id}`}
                          className="font-semibold hover:underline"
                        >
                          {item.employee_id}
                        </Link>
                      </td>
                      <td className="capitalize md:text-center md:w-48 h-12 md:px-5 text-sm md:text-base px-2">
                        {item.full_name}
                      </td>
                      <td className="text-center md:w-44 flex justify-center h-12 text-sm md:text-base">
                        <select
                          className="md:w-36 h-9 px-3 flex justify-center border border-b-[#C5C6C8] border-t-0 border-r-0 border-l-0 bg-[#fff]"
                          value={item.status}
                          onChange={(e) =>
                            handleUpdateStatus(index, e.target.value === "true")
                          }
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </td>

                      <td className="text-center md:w-48 h-12 md:px-5 text-sm md:text-base px-2">
                        {item.role}
                      </td>
                      <td className="md:w-36 h-12">
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
                      <td className="md:w-36 h-12">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={item.permissions.update}
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
                      <td className="md:w-36 h-12">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={item.permissions.delete}
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
                      <td className="flex justify-center">
                        <button
                          className="text-[#fff] bg-[#466EA1] px-2 py-1 rounded-md md:text-md uppercase my-4 mx-auto hover-bg-[#1D2E3E]"
                          type="button"
                          onClick={() => handleSaveChanges(item)}
                          disabled={isSaving}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {data.length > 0 && totalPages > 1 && (
            <div className="flex justify-between mt-4">
              <button
                className="w-20 bg-[#466EA1] text-white p-2 rounded-md mx-2 hover:bg-[#1D2E3E] disabled:cursor-not-allowed disabled:hover:bg-[#466EA1]"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div>
                {getPageNumbers(totalPages).map((page) => (
                  <button
                    key={page}
                    className={`w-12 text-white p-2 rounded-md mx-2 hover:bg-[#1D2E3E] ${
                      currentPage === page ? "bg-[#1D2E3E]" : "bg-[#466EA1]"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="w-20 bg-[#466EA1] text-white p-2 rounded-md mx-2 hover:bg-[#1D2E3E] disabled:cursor-not-allowed disabled:hover:bg-[#466EA1]"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

          {data.length > 0 && (
            <button
              className="text-[#fff] bg-[#466EA1] px-2 py-1 rounded-md md:text-lg uppercase my-4 mx-auto md:ml-2 md:mb-0 hover:bg-[#1D2E3E]"
              type="button"
              onClick={() => handleSaveChanges(data)}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
      {isOpenModal && (
        <PopupModal confirmModal={confirmModal} closeModal={closeModal} />
      )}
      {showPopup && <PopupMessage showPopupMessage={showPopupMessage} />}
    </>
  );
};

export default AdminPanel;
