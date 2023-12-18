"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAccessToken } from "@/utils/common";
import ModalBox from "./modalBox";
import { API_URL } from "../../constant";
let accessToken = getAccessToken();

const VideoUploadForm = ({ onClose }) => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleprojectNameChange = (e) => {
    setProjectName(e.target.value);
  };

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

  const handleUpload = async () => {
    if (!video || !title || !description || !username) {
      console.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", video);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("username", username);
    formData.append("projectName", projectName); // Append category to the form data

    console.log(formData, "formdata");

    try {
      await axios.post(`${API_URL}dashboard/upload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Video uploaded successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <ModalBox onClose={onClose}>
      <div className="container mx-auto bg-[#f8f8f8] ">
        <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upload Video
          </h2>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full py-2 px-3 border-b-2 outline-none"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              ProjectName:
            </label>
            <select
              id="projectName"
              name="projectName"
              value={projectName}
              onChange={handleprojectNameChange}
              className="w-full py-2 px-3 border-b-2 outline-none"
            >
              <option>Select a projectName</option>
              {projects?.map((project) => {
                return (
                  <>
                    <option>{project?.project_name}</option>
                  </>
                );
              })}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2 outline-none"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full py-2 px-3 border-b-2 outline-none"
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              className="w-full py-2 px-3 border-b-2 outline-none"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="video"
              className="block text-gray-700 text-sm font-bold mb-2 "
            >
              Choose a video:
            </label>
            <input
              type="file"
              id="video"
              name="video"
              onChange={handleVideoChange}
              className="w-full py-2 px-3 border-b-2 outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleUpload}
              type="submit"
              className="bg-[#466EA1] text-white py-2 px-4 rounded-md cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </ModalBox>
  );
};

export default VideoUploadForm;
