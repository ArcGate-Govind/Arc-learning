"use client";
import React, { useState } from "react";
import axios from "axios";
import LikeButton from "@/components/Like";
import Comments from "@/components/Comments";

const VideoUpload = () => {
  const [video, setVideo] = useState(null);

  const handleVideoChange = (e) => {
    console.log(e.target.files[0], "video");
    setVideo(e.target.files[0]);
  };
  const handleUpload = async () => {
    if (!video) {
      console.error("No video selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", video);
    try {
      await axios.post("http://127.0.0.1:8000/api/v1/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
