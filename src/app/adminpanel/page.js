"use client";
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AdminPanel = () => {
  const [data, setData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [blankInputError, setBlankInputError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [readPermissionAll, setReadPermissionAll] = useState(false);
  const [updatePermissionAll, setUpdatePermissionAll] = useState(false);
  const [deletePermissionAll, setDeletePermissionAll] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  async function fetchData() {
    try {
      const { employeeId, employeeName, status } = formik.values;
      const queryParams = [];

      if (employeeId) queryParams.push(`user_id=${parseInt(employeeId)}`);
      if (employeeName) queryParams.push(`username=${employeeName}`);
      if (status) {
        const statusValue = status === 'active' ? 1 : 0;
        queryParams.push(`status=${statusValue}`);
      }
      queryParams.push(`page=${currentPage}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      const response = await fetch(`http://127.0.0.1:8000/api/v1/user/data/${queryString}`);
      const json = await response.json();
      setData(json.result);
      setTotalPages(json.pagination.total_pages);

      const newUrl = `${window.location.pathname}${queryString}`;
      window.history.replaceState({}, '', newUrl);
    } catch (error) {
      console.error(error);
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    try {
      console.log("Updated Data:", data);
      console.log("Data updated successfully (console only)");
    } catch (error) {
      console.error(error);
    }
  };

  const validationSchema = Yup.object().shape({
    employeeId: Yup.string(),
    employeeName: Yup.string(),
    status: Yup.string(),
  }).test('Please fill at least one search field', function (values) {
    return !!values.employeeId || !!values.employeeName || !!values.status;
  });

  const formik = useFormik({
    initialValues: {
      employeeId: '',
      employeeName: '',
      status: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (!values.employeeId && !values.employeeName && !values.status) {
        setBlankInputError(true);
      } else {
        setBlankInputError(false);
        const queryParams = [];
        if (values.employeeId) queryParams.push(`user_id=${parseInt(values.employeeId)}`);
        if (values.employeeName) queryParams.push(`username=${values.employeeName}`);
        if (values.status) queryParams.push(`status=${values.status}`);
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        const newUrl = `${window.location.pathname}${queryString}`;
        window.history.replaceState({}, '', newUrl);
        fetchData();
      }
    },
  });

  const handlePermissionUpdate = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index].permission[field] = value;
    setData(updatedData);
  };

  const handleToggleAllPermissions = (index, value) => {
    const updatedData = [...data];
    const user = updatedData[index];
    user.permission.read = value;
    user.permission.update = value;
    user.permission.delete = value;
    setData(updatedData);
  };

  const handleToggleAllReadPermissions = () => {
    const allReadChecked = data.every((item) => item.permission.read);
    const updatedData = data.map((user) => ({
      ...user,
      permission: {
        ...user.permission,
        read: !allReadChecked,
      },
    }));
    setData(updatedData);
    setReadPermissionAll(!allReadChecked);
  };

  const handleToggleAllUpdatePermissions = () => {
    const allUpdateChecked = data.every((item) => item.permission.update);
    const updatedData = data.map((user) => ({
      ...user,
      permission: {
        ...user.permission,
        update: !allUpdateChecked,
      },
    }));
    setData(updatedData);
    setUpdatePermissionAll(!allUpdateChecked);
  };

  const handleToggleAllDeletePermissions = () => {
    const allDeleteChecked = data.every((item) => item.permission.delete);
    const updatedData = data.map((user) => ({
      ...user,
      permission: {
        ...user.permission,
        delete: !allDeleteChecked,
      },
    }));
    setData(updatedData);
    setDeletePermissionAll(!allDeleteChecked);
  };

  useEffect(() => {
    const allReadChecked = data.every((item) => item.permission.read);
    setReadPermissionAll(allReadChecked);

    const allUpdateChecked = data.every((item) => item.permission.update);
    setUpdatePermissionAll(allUpdateChecked);

    const allDeleteChecked = data.every((item) => item.permission.delete);
    setDeletePermissionAll(allDeleteChecked);
  }, [data]);

  const handleUpdateStatus = (index, newStatus) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className='bg-[#f5f5f5] text-center'>
          <div className='flex md:flex-row justify-center items-center md:h-24'>
            <div className='pt-5 md:p-5 md:flex gap-4 text-center md:text-left'>
              <input
                type="text"
                name="employeeId"
                className='w-52 md:w-64 h-8 md:h-9 px-3 border-[#C5C6C8] border rounded-md mb-2 md:mb-0'
                placeholder='Search by Employee Id'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.employeeId}
              />
              <input
                type="text"
                name="employeeName"
                className='w-52 md:w-64 h-8 md:h-9 px-3 border-[#C5C6C8] border rounded-md mb-2 ml-2 md:mb-0 md:ml-0'
                placeholder='Search by Employee Name'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.employeeName}
              />
              <select
                name="status"
                className='w-52 md:w-64 h-8 md:h-9 px-3 bg-[#fff] text-[#9CA4B4] border-[#C5C6C8] border rounded-md mb-2 ml-2 md:mb-0 md:ml-0'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.status}
                placeholder='Search by Employee Status'
              >
                <option value="" className='text-[#C5C6C8]'>Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="text-center md:text-left mr-3 md:mr-0">
              <button className="text-[#fff] bg-[#466EA1] p-2 rounded-md md:text-lg uppercase mb-3 mx-auto md:ml-2 md:mb-0 hover:bg-[#1D2E3E]" type="submit">Search</button>
            </div>
          </div>
          {blankInputError && <div className="text-red-500 block pb-3 md:-mt-5">Please fill in at least one search box</div>}
        </div>
      </form>

      <div>
        <div className="table md:mx-auto md:mt-10 mt-5">
          <table>
            <thead>
              <tr className="bg-[#E3F2FD] h-12">
                <th className="mr-1 md:w-20 h-12 flex justify-center items-center ml-1">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                  />
                </th>
                <th className="text-sm md:w-44 md:text-base">Employee Id</th>
                <th className="w-28 md:w-52 text-sm md:text-base">Employee Name</th>
                <th className="w-24 md:w-44 text-sm md:text-base">Status</th>
                <th className="w-20 md:w-36 text-sm md:text-base">Role</th>
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
                      className="w-4 h-4 ml-1 mr-1"
                      checked={deletePermissionAll}
                      onChange={handleToggleAllDeletePermissions}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="7" className='text-center text-red-500 text-lg font-semibold pt-4'>
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => {
                  return (
                    <tr key={index} className='border border-b-[#f5f5f5] border-t-0 border-r-0 border-l-0'>
                      <td className="md:w-20 h-12 flex justify-center items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={item.permission.read && item.permission.update && item.permission.delete}
                          onChange={(e) => handleToggleAllPermissions(index, e.target.checked)}
                        />
                      </td>
                      <td className="w-32 text-center text-sm md:text-base md:w-40 h-12 md:px-5">{item.user_id}</td>
                      <td className="w-32 md:text-center md:w-48 h-12 md:px-5 text-sm md:text-base px-2">{item.username}</td>
                      <td className="w-20 text-center md:w-44 flex justify-center h-12 text-sm md:text-base">
                        <select
                          className="w-20 md:w-36 h-9 px-3 flex justify-center border border-b-[#C5C6C8] border-t-0 border-r-0 border-l-0 bg-[#fff]"
                          value={item.status === 1 ? "active" : "inactive"}
                          onChange={(e) => handleUpdateStatus(index, e.target.value === "active" ? 1 : 0)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="w-32 text-center md:w-48 h-12 md:px-5 text-sm md:text-base px-2">N/A</td>
                      <td className="md:w-36 h-12">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={item.permission.read}
                            onChange={(e) => handlePermissionUpdate(index, 'read', e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="md:w-36 h-12">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={item.permission.update}
                            onChange={(e) => handlePermissionUpdate(index, 'update', e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="md:w-36 h-12">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={item.permission.delete}
                            onChange={(e) => handlePermissionUpdate(index, 'delete', e.target.checked)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {data.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                className="w-20 bg-[#466EA1] text-white p-2 rounded-md mx-2 hover:bg-[#1D2E3E]"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="w-20 bg-[#466EA1] text-white p-2 rounded-md mx-2 hover:bg-[#1D2E3E]"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}


          {data.length > 0 && (
            <button
              className="text-[#fff] bg-[#466EA1] float-right px-2 py-1 rounded-md md:text-lg uppercase my-4 mx-auto md:ml-2 md:mb-0 hover:bg-[#1D2E3E]"
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div >
    </>
  );
};

export default AdminPanel;
