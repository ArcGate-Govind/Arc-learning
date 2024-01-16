"use client";
import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAccessToken, removeUserSession } from "@/utils/common";
import {
  LOADING_MESSAGE,
  SEARCH_FIELD_MESSAGE,
  SEARCH_RESULT_MESSAGE,
} from "../../message";
import { API_URL } from "../../constant";
import PopupModal from "@/components/popupModal";
import PopupMessage from "@/components/popupMessage";
import ResultPerPage from "@/components/resultPerPage";
import Pagination from "@/components/pagination";
import { userDetailsContext } from "@/context/createContext";

const AdminPanel = () => {
  // Context variables
  const {
    currentPageContext,
    selectedPerPageResultContext,
    selectedSearchValuesContext,
  } = useContext(userDetailsContext);

  // Destructuring context values
  const [currentPage, setCurrentPage] = currentPageContext;
  const [selectedPerPageResult, setShowSelectedPerPageResult] =
    selectedPerPageResultContext;
  const [selectedSearchValues, setShowSelectedSearchValues] =
    selectedSearchValuesContext;

  // Other state variables
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blankInputError, setBlankInputError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState(false);
  const [selectAllPermissionsMap, setSelectAllPermissionsMap] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(true);
  const [readPermissionAll, setReadPermissionAll] = useState(false);
  const [updatePermissionAll, setUpdatePermissionAll] = useState(false);
  const [deletePermissionAll, setDeletePermissionAll] = useState(false);
  const [showPopupMessage, setShowPopupMessage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchClear, setSearchClear] = useState(false);

  // useEffect to initialize selectedUsers state
  useEffect(() => {
    const initialSelectedUsers = data.map(() => false);
    setSelectedUsers(initialSelectedUsers);
  }, []);

  // useEffect to fetch data and update selectAllPermissionsMap based on currentPage
  useEffect(() => {
    fetchData();
    if (currentPage && !selectAllPermissionsMap[currentPage]) {
      setSelectAllPermissionsMap({
        ...selectAllPermissionsMap,
        [currentPage]: false,
      });
    }
  }, [currentPage, selectedPerPageResult, selectedSearchValues]);

  // Fetch initial data and set up permissions map when the page loads or context changes
  const accessToken = getAccessToken();
  async function fetchData() {
    try {
      setLoading(true);
      const queryParams = [];
      if (selectedSearchValues != null) {
        if (selectedSearchValues.employeeId) {
          queryParams.push(`employee_id=${selectedSearchValues.employeeId}`);
        }
        if (selectedSearchValues.employeeName) {
          queryParams.push(`full_name=${selectedSearchValues.employeeName}`);
        }
        if (selectedSearchValues.status) {
          const statusText =
            selectedSearchValues.status === "true" ? "true" : "false";
          queryParams.push(`status=${statusText}`);
        }
      }

      queryParams.push(`page=${currentPage}`);
      queryParams.push(`page_size=${selectedPerPageResult}`);
      const queryString =
        queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
      const newUrl = `${window.location.pathname}${queryString}`;
      window.history.replaceState({}, "", newUrl);

      const response = await fetch(`${API_URL}users/${queryString}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const json = await response.json();
      let authorizationData;
      if (json.results.length > 0) {
        authorizationData = json.results ? json.results : [];
        setLoading(false);
        setTotalPages(json.pagination.total_pages);
      } else if (json.results.length == 0) {
        authorizationData = json.results ? json.results : [];
        setTotalPages(json.pagination ? json.pagination.total_pages : 0);
      } else {
        removeUserSession();
        router.push("/");
        authorizationData = [];
      }
      setData(authorizationData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

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

  // Save changes to the server (save button)
  const handleSaveChanges = async (user = null) => {
    setIsSaving(true);
    try {
      let updatedData = data.filter((user) => user.unsavedChanges);

      if (Object.keys(selectedUsers).length > 0) {
        updatedData = updatedData.filter((user) => selectedUsers[user.user_id]);
      }

      if (user) {
        if (Array.isArray(user)) {
          updatedData = user;
        } else {
          updatedData = [user];
        }
      }
      if (Object.keys(selectedUsers).length > 0) {
        updatedData = updatedData.filter((user) => selectedUsers[user.user_id]);
      }

      if (user) {
        if (Array.isArray(user)) {
          updatedData = user;
        } else {
          updatedData = [user];
        }
      }

      if (updatedData.length > 0) {
        const response = await fetch(`${API_URL}user/update/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedData),
        });
        const json = await response.json();

        if (json.code === 200) {
          setUnsavedChanges(false);
          setShowPopupMessage(json.message);
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
          }, 1500);
          setSelectAllPermissionsMap({});
          setSelectedUsers({});
        } else {
          setShowPopupMessage(response.statusText);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form submission for search
  const handleFormSubmit = () => {
    if (
      !formik.values.employeeId &&
      !formik.values.employeeName &&
      !formik.values.status
    ) {
      setBlankInputError(true);
    } else {
      setBlankInputError(false);
      setCurrentPage(1);
    }
  };

  // Form validation schema using Yup
  const validationSchema = Yup.object()
    .shape({
      employeeId: Yup.string(),
      employeeName: Yup.string(),
      status: Yup.string(),
    })
    .test({ SEARCH_FIELD_MESSAGE }, function (values) {
      return !!values.employeeId || !!values.employeeName || !!values.status;
    });

  // Formik form configuration
  const formik = useFormik({
    initialValues: {
      employeeId: selectedSearchValues.employeeId,
      employeeName: selectedSearchValues.employeeName,
      status: selectedSearchValues.status,
    },
    validationSchema,
    onSubmit: (values) => {
      const trimedValue = {
        employeeId: values.employeeId.trim(),
        employeeName: values.employeeName.trim(),
        status: values.status,
      };
      if (
        trimedValue.employeeId != "" ||
        trimedValue.employeeName != "" ||
        trimedValue.status != ""
      ) {
        setShowSelectedSearchValues(trimedValue);
      }
      if (searchClear) {
        setBlankInputError(false);
      } else if (
        !trimedValue.employeeId &&
        !trimedValue.employeeName &&
        !trimedValue.status &&
        !searchClear
      ) {
        setBlankInputError(true);
      } else {
        setBlankInputError(false);
        setCurrentPage(1);
      }
    },
  });

  // Handle permission update for a specific user
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

  // Toggle all permissions for all users on the current page
  const handleToggleAllPermissions = (checked) => {
    const updatedSelectedUsers = {};
    data.forEach((user) => {
      updatedSelectedUsers[user.user_id] = checked;
    });

    setSelectedUsers(updatedSelectedUsers);

    const updatedSelectAllPermissionsMap = { ...selectAllPermissionsMap };
    updatedSelectAllPermissionsMap[currentPage] = checked;
    setSelectAllPermissionsMap(updatedSelectAllPermissionsMap);
  };

  // Toggle permissions for a specific user
  const handleToggleUserPermissions = (user_id, checked) => {
    const updatedSelectedUsers = { ...selectedUsers };
    updatedSelectedUsers[user_id] = checked;
    setSelectedUsers(updatedSelectedUsers);

    const allChecked = data.every((user) => updatedSelectedUsers[user.user_id]);
    const updatedSelectAllPermissionsMap = { ...selectAllPermissionsMap };
    updatedSelectAllPermissionsMap[currentPage] = allChecked;
    setSelectAllPermissionsMap(updatedSelectAllPermissionsMap);
  };

  // Toggle read permissions for all users
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

  // Toggle update permissions for all users
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

  // Toggle delete permissions for all users
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

  // Update state variables when data changes
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
  }, [data]);

  // Handle status update for a specific user
  const handleUpdateStatus = (index, newStatus) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    updatedData[index].unsavedChanges = true;
    setData(updatedData);
    setUnsavedChanges(true);
  };

  // Clear the search form and reload the page
  const handleFormClear = () => {
    setSearchClear(true);
    const newUrl = `${window.location.pathname}?page=${currentPage}`;
    window.history.replaceState({}, "", newUrl);
    window.location.reload();
  };

  // Sort data based on employee_id
  const sortedData = data.sort((a, b) => {
    return a?.employee_id.localeCompare(b?.employee_id);
  });

  // Render the component
  return (
    <>
      {/* Search form */}
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-[#f5f5f5] text-center">
          <div className="block md:flex md:flex-row justify-center items-center md:h-24">
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
                className="w-64 md:w-64 h-8 md:h-9 px-3 bg-[#fff] text-[#9CA4B4] border-[#C5C6C8] border rounded-md mb-2 ml-2 md:mb-0 md:ml-0"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.status}
                placeholder="Search by Employee Status"
              >
                <option value="" className="text-[#C5C6C8]">
                  Select Status
                </option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="text-center md:text-left mr-3 md:mr-0">
              <button
                className="ml-2 text-[#fff] bg-[#466EA1] p-2 rounded-md md:text-lg uppercase mb-1 mx-auto md:ml-2 md:mb-0 hover:bg-[#1D2E3E]"
                type="submit"
                onClick={handleFormSubmit}
              >
                Search
              </button>
              <button
                className="ml-2 text-[#fff] bg-[#466EA1] p-2 rounded-md md:text-lg uppercase mb-3 mx-auto md:ml-2 md:mb-0 hover:bg-[#1D2E3E]"
                type="submit"
                onClick={handleFormClear}
              >
                Clear
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

      {/* Data table */}
      <div className="table mx-auto md:mt-5 mt-5">
        <div className="flex justify-end">
          {/* Results per page and Save Changes button */}
          {data.length > 0 && (
            <div className="flex items-center justify-between">
              <ResultPerPage
                setShowSelectedPerPageResult={setShowSelectedPerPageResult}
                selectedPerPageResult={selectedPerPageResult}
                setCurrentPage={setCurrentPage}
              />
              <button
                name="Save Changes"
                data-testid="save-changes-button"
                className="text-[#fff] bg-[#466EA1] px-2 py-1 disabled:cursor-not-allowed disabled:hover:bg-[#728daf] rounded-md md:text-lg uppercase my-4 hover:bg-[#1D2E3E]"
                type="button"
                onClick={() => {
                  if (unsavedChanges) {
                    const selectedUsersToSave = data.filter(
                      (item) =>
                        item.unsavedChanges && selectedUsers[item.user_id]
                    );
                    if (selectedUsersToSave.length > 0) {
                      handleSaveChanges(selectedUsersToSave);
                    }
                  }
                }}
                disabled={
                  isSaving ||
                  Object.values(selectedUsers).every(
                    (selected) => !selected || !unsavedChanges
                  )
                }
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Data table */}
        <table
          className="border-2 border-[#F5F5F5] shadow-lg"
          data-testid="admin-panel"
          data-data={JSON.stringify(data)}
        >
          {/* Table Header */}
          <thead>
            <tr className="bg-[#E3F2FD] h-12">
              <th className="mr-1 md:w-20 h-12 flex justify-center items-center ml-1">
                <input
                  data-testid="toggle-all-permissions-checkbox"
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectAllPermissionsMap[currentPage] || false}
                  onChange={(e) => handleToggleAllPermissions(e.target.checked)}
                  name="Toggle All Permissions"
                />
              </th>
              <th className="text-sm md:w-44 md:text-base">Employee Id</th>
              <th className="md:w-52 text-sm md:text-base">Employee Name</th>
              <th className="md:w-44 text-sm md:text-base">Status</th>
              <th className="md:w-36 h-12 text-center text-sm md:text-base">
                <div className="flex items-center justify-center mr-2">
                  <span className="md:mr-2">Read</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 ml-1"
                    checked={readPermissionAll}
                    onChange={handleToggleAllReadPermissions}
                    data-testid="read-checkbox"
                  />
                </div>
              </th>
              <th className="md:w-36 h-12 text-center text-sm md:text-base">
                <div className="flex items-center justify-center mr-2">
                  <span className="md:mr-2">Update</span>
                  <input
                    type="checkbox"
                    className={`${
                      readPermissionAll ? "" : "cursor-not-allowed"
                    } w-4 h-4 ml-1`}
                    checked={readPermissionAll ? updatePermissionAll : false}
                    onChange={handleToggleAllUpdatePermissions}
                    data-testid="update-checkbox"
                  />
                </div>
              </th>
              <th className="md:w-36 h-12 text-center text-sm md:text-base">
                <div className="flex items-center justify-center">
                  <span className="md:mr-2">Delete</span>
                  <input
                    type="checkbox"
                    className={`${
                      readPermissionAll ? "" : "cursor-not-allowed"
                    } w-4 h-4 ml-1`}
                    checked={readPermissionAll ? deletePermissionAll : false}
                    onChange={handleToggleAllDeletePermissions}
                    data-testid="delete-checkbox"
                  />
                </div>
              </th>
              <th className="md:w-36">
                <p>Save Changes</p>
              </th>
            </tr>
          </thead>
          {/* Table Body */}
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
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-red-600 text-center py-3">
                  {SEARCH_RESULT_MESSAGE}
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => {
                const isSelected = selectedUsers[item.user_id];

                return (
                  <tr
                    key={index}
                    className={`border border-b-[#f5f5f5] border-t-0 border-r-0 border-l-0 ${
                      isSelected ? "bg-[#f5f5f5] border-b-[#ffff]" : ""
                    }`}
                  >
                    <td className="md:w-20 h-12 flex justify-center items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedUsers[item.user_id] || false}
                        onChange={(e) =>
                          handleToggleUserPermissions(
                            item.user_id,
                            e.target.checked
                          )
                        }
                        data-testid={`user-checkbox-${item.user_id}`}
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
                        data-testid={`status-dropdown-${item.user_id}`}
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
                      <div className="flex items-center justify-center ">
                        <input
                          type="checkbox"
                          className={`${
                            item.permissions.read ? "" : "cursor-not-allowed"
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
                    <td className="md:w-36 h-12">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          className={`${
                            item.permissions.read ? "" : "cursor-not-allowed"
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
                    <td className="flex justify-center">
                      {item.unsavedChanges ? (
                        <button
                          className="text-[#fff] bg-[#466EA1] px-2 py-1 rounded-md md:text-md uppercase my-4 mx-auto hover-bg-[#1D2E3E]"
                          onClick={() => handleSaveChanges(item)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          data-testid="disable-save-button"
                          disabled
                          className="text-[#fff] bg-[#466EA1] px-2 py-1 rounded-md md:text-md uppercase my-4 mx-auto disabled:cursor-not-allowed disabled:hover:bg-[#728daf] "
                        >
                          Save
                        </button>
                      )}
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

      {/* Modals */}
      {isOpenModal && (
        <PopupModal confirmModal={confirmModal} closeModal={closeModal} />
      )}
      {showPopup && <PopupMessage showPopupMessage={showPopupMessage} />}
    </>
  );
};

export default AdminPanel;
