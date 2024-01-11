import React from "react";
import { UNSAVED_ALERT_MESSAGE } from "../../message";

const PopupModal = ({ closeModal, confirmModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
        onClick={closeModal}
      ></div>

      <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content py-4 text-left px-6">
          <p className="text-gray-700 my-4">{UNSAVED_ALERT_MESSAGE}</p>
          <div className="text-right mt-4">
            <button
              className="text-[#fff] bg-[#466EA1] p-2 rounded-md font-bold py-2 px-4 mr-4"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              className="text-[#fff] bg-[#466EA1] p-2 rounded-md py-2 px-4 rounded"
              onClick={confirmModal}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;

