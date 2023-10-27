import React from "react";

const PopupMessage = ({ showPopupMessage }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

      <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content py-4 text-left px-6">
          {/* <div className="text-xl font-bold">Modal Title</div> */}
          <p className="text-gray-700 my-4">{showPopupMessage} </p>
        </div>
      </div>
    </div>
  );
};

export default PopupMessage;
