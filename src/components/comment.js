import React, { useState, useEffect } from "react";

const Comment = ({ onClose }) => {
  const [showCommentMessage, setShowCommentMessage] = useState("");
  const [showAllCommentMessage, setShowAllCommentMessage] = useState([]);

  useEffect(() => {
    const storedComments = localStorage.getItem("comments");
    if (storedComments) {
      setShowAllCommentMessage(JSON.parse(storedComments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(showAllCommentMessage));
  }, [showAllCommentMessage]);

  const handleComment = (event) => {
    setShowCommentMessage(event.target.value);
  };

  const getCommentValue = () => {
    if (showCommentMessage.trim() !== "") {
      setShowAllCommentMessage([...showAllCommentMessage, showCommentMessage]);
      setShowCommentMessage("");
    }
  };

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
          <button
            onClick={getCommentValue}
            className={`${
              showCommentMessage ? "cursor-pointer" : " cursor-not-allowed"
            } hover:text-[#466EA1] bg-[#466EA1] hover:bg-gray-200 text-[#FFFFFF] p-2 rounded-md px-4 rounded`}
          >
            Comment
          </button>
          <button
            onClick={onClose}
            className="hover:text-[#466EA1] bg-[#466EA1] hover:bg-gray-200 text-[#FFFFFF] p-2 cursor-pointer rounded-md px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex flex-col">
          {showAllCommentMessage.map((comment, index) => (
            <div
              title={comment}
              key={index}
              className="p-1 text-xs rounded  line-clamp-2"
            >
              {comment}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comment;
