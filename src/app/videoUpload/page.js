"use client";
import React, { useState,useEffect } from "react";
import { API_URL } from "../../../constant";
import axios from "axios";
import { getaccessToken  } from "@/utils/common";
let accessToken = getaccessToken();

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const [projectName, setProjectName] = useState(""); 
  const [projects,setProjects] = useState([])


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
        const response = await fetch("http://127.0.0.1:8000/api/v1/projects/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response?.json();
        setProjects(data)
        console.log(data,"data");
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

    console.log(formData,"formdata");

    try {
      await axios.post("http://127.0.0.1:8000/api/v1/dashboard/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Video uploaded successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
      // Handle error (e.g., retrying the upload)
    }
  };

  return (
    <div className="container mx-auto mt-8">
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
            className="w-full py-2 px-3 border rounded-md"
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
            className="w-full py-2 px-3 border rounded-md"
          >
             <option value="">Select a projectName</option>
          {
            projects?.map((project)=>{
              return(

           <>
        
            <option value="technology">{project?.project_name}</option>
           </>
           
         
              )
            })
          }
          </select>
          
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            className="w-full py-2 px-3 border rounded-md"
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
            className="w-full py-2 px-3 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="video"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Choose a video:
          </label>
          <input
            type="file"
            id="video"
            name="video"
            onChange={handleVideoChange}
            className="w-full py-2 px-3 border rounded-md"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleUpload}
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
