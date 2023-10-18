"use client";
import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getaccessToken, removeUserSession } from '@/utils/common';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../../globals';
import Link from 'next/link';
import { userDetailsContext } from '../../context/createContext';

const AdminPanel = () => {
  const [currentPage, setCurrentPage] = useContext(userDetailsContext);
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blankInputError, setBlankInputError] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectAllRead, setSelectAllRead] = useState(false);
  const [selectAllUpdate, setSelectAllUpdate] = useState(false);
  const [selectAllDelete, setSelectAllDelete] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // console.log("currentPage",currentPage)
  const accessToken = getaccessToken()
  async function fetchData() {
    try {
      setLoading(true);

      const { employeeId, employeeName, status } = formik.values;
      const queryParams = [];

      if (employeeId) queryParams.push(`employee_id=${employeeId}`);
      if (employeeName) queryParams.push(`fullname=${employeeName}`);
      if (status) {
        const statusText = status === 'Active' ? 'Active' : 'Inactive';
        queryParams.push(`status=${statusText}`);
      }

      queryParams.push(`page=${currentPage}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      const response = await fetch(`${API_URL}users/${queryString}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const json = await response.json();
      console.log("jsonjjjjjj",json);
      let authorizationData;

      if (json.code == 200) {
        authorizationData = json.results ? json.results : []
      } else {
        removeUserSession();
        router.push("/")
        authorizationData = []
      }
      setData(authorizationData);

      setTotalPages(json.pagination.total_pages);

      // const newUrl = `${window.location.pathname}${queryString}`;
      // window.history.replaceState({}, '', newUrl);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
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

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const updatedData = data;
      const response = await fetch(`${API_URL}user/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        console.log('Data updated successfully');
      } else {
        console.error('Failed to update data');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
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
        if (values.employeeId) queryParams.push(`employee_id=${values.employeeId}`);
        if (values.employeeName) queryParams.push(`fullname=${values.employeeName}`);
        if (values.status) queryParams.push(`status=${values.status}`);
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        const newUrl = `${window.location.pathname}${queryString}`;
        window.history.replaceState({}, '', newUrl);
        fetchData();
      }
    },
  });

  const updateSelectAllCheckboxes = () => {
    const shouldSelectAllRead = data.every(item => item.permissions.read);
    const shouldSelectAllUpdate = data.every(item => item.permissions.update);
    const shouldSelectAllDelete = data.every(item => item.permissions.delete);

    setSelectAllRead(shouldSelectAllRead);
    setSelectAllUpdate(shouldSelectAllUpdate);
    setSelectAllDelete(shouldSelectAllDelete);
  };

  const handlePermissionUpdate = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index].permissions[field] = value;
    setData(updatedData);

    if (field === 'read') {
      const shouldSelectAllRead = updatedData.every(item => item.permissions.read);
      setSelectAllRead(shouldSelectAllRead);
    } else if (field === 'update') {
      const shouldSelectAllUpdate = updatedData.every(item => item.permissions.update);
      setSelectAllUpdate(shouldSelectAllUpdate);
    } else if (field === 'delete') {
      const shouldSelectAllDelete = updatedData.every(item => item.permissions.delete);
      setSelectAllDelete(shouldSelectAllDelete);
    }
  };

  const handleUpdateStatus = (index, newStatus) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);
  };

  const handleToggleAllReadPermissions = (event) => {
    const checked = event.target.checked;
    const updatedData = data.map((item) => {
     
      return {
        ...item,
        permissions: {
          ...item.permissions,
          read: checked,
        },
      };
    });
    setData(updatedData);
    setSelectAllRead(checked);
  };

  const handleToggleAllUpdatePermissions = (event) => {
    const checked = event.target.checked;
    const updatedData = data.map((item) => {
      return {
        ...item,
        permissions: {
          ...item.permissions,
          update: checked,
        },
      };
    });
    setData(updatedData);
    setSelectAllUpdate(checked);
  };

  const handleToggleAllDeletePermissions = (event) => {
    const checked = event.target.checked;
    const updatedData = data.map((item) => {
      return {
        ...item,
        permissions: {
          ...item.permissions,
          delete: checked,
        },
      };
    });
    setData(updatedData);
    setSelectAllDelete(checked);
  };

  const getPageNumbers = (totalPages) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
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
                className='md:w-64 h-8 md:h-9 px-3 border-[#C5C6C8] border rounded-md mb-2 md:mb-0'
                placeholder='Search by Employee Id'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.employeeId}
              />
              <input
                type="text"
                name="employeeName"
                className='md:w-64 h-8 md:h-9 px-3 border-[#C5C6C8] border rounded-md mb-2 ml-2 md:mb-0 md:ml-0'
                placeholder='Search by Employee Name'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.employeeName}
              />
              <select
                name="status"
                className='md:w-64 h-8 md:h-9 px-3 bg-[#fff] text-[#9CA4B4] border-[#C5C6C8] border rounded-md mb-2 ml-2 md:mb-0 md:ml-0'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.status}
                placeholder='Search by Employee Status'
              >
                <option value="" className='text-[#C5C6C8]'>Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
        <div className="table mx-auto md:mt-10 mt-5">
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
                <th className="md:w-52 text-sm md:text-base">Employee Name</th>
                <th className="md:w-44 text-sm md:text-base">Status</th>
                <th className="md:w-36 text-sm md:text-base">Role</th>
                <th className="md:w-36 h-12 text-center text-sm md:text-base">
                  <div className="flex items-center justify-center mr-2">
                    <span className="md:mr-2">Read</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 ml-1"
                      checked={selectAllRead}
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
                      checked={selectAllUpdate}
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
                      checked={selectAllDelete}
                      onChange={handleToggleAllDeletePermissions}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8">Loading...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="8">No results found</td>
                </tr>
              ) : (
                data.map((item, index) => {
                  return (
                    <tr key={index} className='border border-b-[#f5f5f5] border-t-0 border-r-0 border-l-0'>
                      <td className="md:w-20 h-12 flex justify-center items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                        // checked={item.permission.read && item.permission.update && item.permission.delete}
                        // onChange={(e) => handleToggleAllPermissions(index, e.target.checked)}
                        />
                      </td>
                      <td className="text-center text-sm md:text-base md:w-40 h-12 md:px-5" key={item.user_id}  ><Link href={`adminpanel/${item.user_id}`}>{item.employee_id}</Link></td>
                      <td className="capitalize md:text-center md:w-48 h-12 md:px-5 text-sm md:text-base px-2">{item.fullname}</td>
                      <td className="text-center md:w-44 flex justify-center h-12 text-sm md:text-base">
                        <select
                          className="md:w-36 h-9 px-3 flex justify-center border border-b-[#C5C6C8] border-t-0 border-r-0 border-l-0 bg-[#fff]"
                          value={item.status}
                          onChange={(e) => handleUpdateStatus(index, e.target.value)}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>

                      <td className="text-center md:w-48 h-12 md:px-5 text-sm md:text-base px-2">{item.role}</td>
                      <td className="md:w-36 h-12">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={item.permissions.read}
                            onChange={(e) => handlePermissionUpdate(index, 'read', e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="md:w-36 h-12">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={item.permissions.update}
                            onChange={(e) => handlePermissionUpdate(index, 'update', e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="md:w-36 h-12">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={item.permissions.delete}
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
            <div className="flex justify-between mt-4">
              <button
                className="w-20 bg-[#466EA1] text-white p-2 rounded-md mx-2 hover:bg-[#1D2E3E]"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div>
                {getPageNumbers(totalPages).map((page) => (
                  <button
                    key={page}
                    className={`w-12 text-white p-2 rounded-md mx-2 hover:bg-[#1D2E3E] ${currentPage === page ? 'bg-[#1D2E3E]' : 'bg-[#466EA1]'
                      }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="w-20 bg-[#466EA1] text-white p-2 rounded-md mx-2 hover-bg-[#1D2E3E]"
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
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
