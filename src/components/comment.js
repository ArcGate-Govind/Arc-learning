import React, { useState, useEffect } from "react";
import { API_URL } from "../../constant";
import moment from "moment";
import { api } from "@/utils/helper";

const Comment = ({ onClose, videoId }) => {
  // State
  const [showCommentMessage, setShowCommentMessage] = useState("");
  const [showAllCommentMessage, setShowAllCommentMessage] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Fetch comments for the current video on component mount
  useEffect(() => {
    getCommentData();
  }, []);

  // Handle input change for adding or editing comments
  const handleComment = (event) => {
    setShowCommentMessage(event.target.value);
  };

  // Fetch comments for the current video
  const getCommentData = async () => {
    try {
      const response = await api.get(
        `${API_URL}dashboard/comments/?video_id=${videoId}`
      );
      if (response.status == 200) {
        setShowAllCommentMessage(response.data.comments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Post a new comment
  const getCommentValue = async () => {
    if (showCommentMessage.trim() !== "") {
      let video = videoId;
      let comment = showCommentMessage;
      try {
        const response = await api.post(`${API_URL}dashboard/comments/`, {
          comment,
          video,
        });
        if (response.status == 201) {
          setShowCommentMessage("");
          getCommentData();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Handle edit button click, populate the input with the selected comment
  const handleEdit = (comment, index) => {
    setShowCommentMessage(comment);
    setEditingIndex(index);
  };

  // Update an existing comment
  const updateComment = async () => {
    if (showCommentMessage.trim() !== "") {
      let video = videoId;
      let comment = showCommentMessage;
      let id = editingIndex;
      try {
        const response = await api.put(`${API_URL}dashboard/comments/`, {
          comment,
          video,
          id,
        });

        if (response.status == 200) {
          setShowCommentMessage("");
          setEditingIndex(null);
          getCommentData();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Handle delete button click, delete the selected comment
  const handleDelete = async (index) => {
    try {
      const response = await api.delete(
        `${API_URL}dashboard/comments/?id=${index}`
      );
      if (response.status == 200) {
        getCommentData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Rendering JSX
  return (
    <div className="mt-8">
      <div className="flex items-center mb-4">
        <input
          value={showCommentMessage}
          onChange={handleComment}
          type="text"
          rows="4"
          placeholder="Add a comment..."
          className="flex-grow py-2 px-3 shadow-md outline-none"
        />
        <div className="space-x-4">
          {editingIndex !== null ? (
            <button
              onClick={updateComment}
              className={`${
                showCommentMessage.trim()
                  ? "cursor-pointer"
                  : " cursor-not-allowed"
              } hover:text-[#466EA1] bg-[#466EA1] hover:bg-gray-200 text-[#FFFFFF] text-sm p-1 rounded-md px-2 py-2 rounded `}
            >
              Update
            </button>
          ) : (
            <button
              onClick={getCommentValue}
              className={`${
                showCommentMessage.trim()
                  ? "cursor-pointer"
                  : " cursor-not-allowed"
              } hover:text-[#466EA1] bg-[#466EA1] hover:bg-gray-200 text-[#FFFFFF] text-sm p-1 rounded-md px-2 py-2 rounded `}
            >
              Comment
            </button>
          )}
          <button
            onClick={onClose}
            className="hover:text-[#466EA1] bg-[#466EA1] hover:bg-gray-200 text-[#FFFFFF] text-sm p-1 cursor-pointer rounded-md px-2 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex flex-col">
          {showAllCommentMessage.map((commentData, index) => (
            <div key={index} className="p-1 text-xs rounded ">
              <div className="flex items-center">
                <p className="mb-1 line-clamp-2 flex-grow mr-2">
                  {commentData.comment}
                </p>
                <button
                  data-testid="Edit"
                  onClick={() =>
                    handleEdit(commentData.comment, commentData.id)
                  }
                  className="mr-4 text-lg"
                >
                  <i className="fa fa-pencil-square-o"></i>
                </button>

                <button
                  data-testid="Delete"
                  onClick={() => handleDelete(commentData.id)}
                  className="text-lg "
                >
                  <i className="fa fa-trash-o"></i>
                </button>
              </div>

              <div className="flex items-center  text-gray-500">
                <p className="mr-2">{commentData.username}</p>
                <p>{moment(commentData.modified).fromNow()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comment;
