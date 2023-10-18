"use client";
import { useEffect, useState } from "react";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState("");

  useEffect(() => {
    userinfo();
  }, []);

  async function userinfo() {
    try {
      const data = await fetch("http://127.0.0.1:8000/api/v1/user/data/1/");
      const json = await data.json();
      setUserDetails(json);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="lg:flex">
          {userDetails === ""
            ? "Loading"
            : userDetails?.project?.map((userinfo) => {
                return (
                  <>
                    <div className="w-full lg:w-1/5 bg-white p-4">
                      <div className="bg-[#F5F5F5] mt-20">
                        <p className="dot margin text-center">G</p>
                        <h3 className="px-4 py-2">
                          Employee:{userinfo[0]?.username}
                        </h3>
                        <h3 className="px-4 py-2">
                          Employee id:{userinfo[0]?.user_id}
                        </h3>
                        <h3 className="px-4 py-2">
                          Email:{userinfo[0]?.email}
                        </h3>
                        <h3 className="px-4 py-2">
                          Status:
                          {userinfo[0]?.status == 1 ? "active" : "unactive"}
                        </h3>
                        <h3 className="px-4 py-2">
                          Project:{userinfo[0]?.project}
                        </h3>
                      </div>
                    </div>
                    <div className="w-full lg:w-4/5 bg-white p-4">
                      <div className="m-2 w-full lg:w-[75%] overflow-x-auto">
                        <div key={userinfo[0].project}>
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
                                  />
                                </th>
                                <th className="px-6 py-3 bg-[#E3F2FD] text-left">
                                  Update{" "}
                                  <input
                                    type="checkbox"
                                    className="form-checkbox m-2 h-4 w-4 text-indigo-600"
                                  />
                                </th>
                                <th className="px-6 py-3 bg-[#E3F2FD] text-left">
                                  Delete{" "}
                                  <input
                                    type="checkbox"
                                    className="form-checkbox m-2 h-4 w-4 text-indigo-600"
                                  />
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                                  {userinfo[0].project}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-indigo-600"
                                    checked={userinfo[0].permission.read}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-indigo-600"
                                    checked={userinfo[0].permission.update}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-indigo-600"
                                    checked={userinfo[0].permission.delete}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="flex justify-center lg:justify-end mt-6">
                            <button className="mx-20 bg-[#466EA1] p-1 rounded-md text-white">
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
