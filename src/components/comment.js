import React, { useState, useEffect } from "react";

const Comment = ({ onClose }) => {
  const [showCommentMessage, setShowCommentMessage] = useState("");
  const [showAllCommentMessage, setShowAllCommentMessage] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

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
      if (editingIndex !== null) {
        const updatedComments = [...showAllCommentMessage];
        updatedComments[editingIndex] = showCommentMessage;
        setShowAllCommentMessage(updatedComments);
        setEditingIndex(null);
      } else {
        setShowAllCommentMessage([
          ...showAllCommentMessage,
          showCommentMessage,
        ]);
      }
      setShowCommentMessage("");
    }
  };

  const handleEdit = (comment, index) => {
    setShowCommentMessage(comment);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedComments = [...showAllCommentMessage];
    updatedComments.splice(index, 1);
    setShowAllCommentMessage(updatedComments);
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
            } hover:text-[#466EA1] bg-[#466EA1] hover:bg-gray-200 text-[#FFFFFF] text-sm p-1 rounded-md px-2 py-2 rounded `}
          >
            {editingIndex !== null ? "Update" : "Comment"}
          </button>
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
          {showAllCommentMessage.map((comment, index) => (
            <div key={index} className="p-1 text-xs rounded ">
              <div className="flex items-center">
                <p className="mb-1 line-clamp-2 flex-grow mr-2">{comment}</p>
                <button
                 data-testid="Edit"
                  onClick={() => handleEdit(comment, index)}
                  className="mr-4 text-lg"
                >
                  <i className="fa fa-pencil-square-o"></i>
                </button>

                <button
                 data-testid="Delete"
                  onClick={() => handleDelete(index)}
                  className="text-lg "
                >
                  <i className="fa fa-trash-o"></i>
                </button>
              </div>

              <div className="flex items-center  text-gray-500">
                <p className="mr-2">username</p>
                <p>12/12/2023</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comment;

