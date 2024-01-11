import React from "react";

function ModalBox({ onClose, children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

      <div className="modal-container bg-white w-3/4 md:w-1/2 mx-auto rounded shadow-lg z-50 overflow-y-auto max-h-[90vh]">
        <div className="modal-content py-2 text-left px-2">
          <div className="text-right mt-2">
            <button
              className="hover:text-[#466EA1] bg-[#466EA1] hover:bg-gray-200 text-[#FFFFFF]  p-2 rounded-md px-4 rounded"
              onClick={onClose}
            >
              X
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default ModalBox;
