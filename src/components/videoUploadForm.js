"use client"
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { getAccessToken } from "@/utils/common";
import ModalBox from "./modalBox";
import { API_URL } from "../../constant";
import Image from "next/image";
import videoUpload from "@/image/video.png";
import PopupMessage from "@/components/popupMessage";

const accessToken = getAccessToken();

const VideoUploadForm = ({ onClose }) => {
  const [projects, setProjects] = useState([]);
  const [showPopupMessage, setShowPopupMessage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}projects/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response?.json();
        setProjects(data);
        console.log(data, "data");
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      projectName: "",
      description: "",
      username: "",
      video: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      projectName: Yup.string().required("Project Name is required"),
      description: Yup.string().required("Description is required"),
      username: Yup.string().required("Username is required"),
      video: Yup.mixed().required("Video is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("file", values.video);
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("username", values.username);
        formData.append("projectName", values.projectName);

        console.log(formData, "formdata");

        const response = await axios.post(
          `${API_URL}dashboard/upload/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          setShowPopupMessage(response.data.message);
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
          }, 1000);
          console.log("response", response);
        }
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    },
  });

  return (
    <ModalBox onClose={onClose}>
      <div className="container mx-auto p-5 ">
        <div className="max-w-md mx-auto bg-[#F8F8F8] p-6 rounded-md shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Upload Video
            </h2>
            <Image
              src={videoUpload}
              alt="videoUpload"
              className="w-12 md:w-16 pt-1"
            />
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 font-semibold mb-1"
              >
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full py-2 px-3 shadow-md ${
                  formik.touched.title && formik.errors.title
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500">{formik.errors.title}</div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="projectName"
                className="block text-gray-700 font-semibold mb-1"
              >
                Project Name:
              </label>
              <select
                id="projectName"
                name="projectName"
                value={formik.values.projectName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full py-2 px-3 bg-[#FFFFFF] cursor-pointer shadow-md outline-none ${
                  formik.touched.projectName && formik.errors.projectName
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option>Select a project name</option>
                {projects?.map((project) => (
                  <option key={project?.project_name}>
                    {project?.project_name}
                  </option>
                ))}
              </select>
              {formik.touched.projectName && formik.errors.projectName && (
                <div className="text-red-500">{formik.errors.projectName}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 font-semibold outline-none mb-1"
              >
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full py-2 px-3 shadow-md outline-none ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500"
                    : ""
                }`}
              ></textarea>
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500">{formik.errors.description}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-semibold mb-1"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full py-2 px-3 shadow-md outline-none ${
                  formik.touched.username && formik.errors.username
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500">{formik.errors.username}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="video"
                className="block text-gray-700 font-semibold mb-1"
              >
                Choose a video:
              </label>
              <input
                type="file"
                id="video"
                name="video"
                onChange={(event) => {
                  formik.setFieldValue("video", event.currentTarget.files[0]);
                }}
                className={`w-full py-2 px-3 bg-[#FFFFFF] cursor-pointer shadow-md outline-none ${
                  formik.touched.video && formik.errors.video
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.video && formik.errors.video && (
                <div className="text-red-500">{formik.errors.video}</div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#466EA1] text-white py-2 px-4 rounded-md cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
              >
                Upload
              </button>
            </div>
          </form>
          {showPopup && <PopupMessage showPopupMessage={showPopupMessage} />}
        </div>
      </div>
    </ModalBox>
  );
};

export default VideoUploadForm;
