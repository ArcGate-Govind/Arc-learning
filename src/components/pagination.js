import React from "react";

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
  unsavedChanges,
  isConfirmModal,
}) => {
  const handlePrevPage = () => {
    if (unsavedChanges) {
      setIsOpenModal(true);
    } else if (isConfirmModal && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (unsavedChanges) {
      setIsOpenModal(true);
    } else if (isConfirmModal && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = (totalPages, currentPage) => {
    const maxVisiblePages = 3;
    const pageNumbers = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <>
      <div className="flex justify-center  mt-8 ">
        <button
          data-testid="previous-button"
          className="w-20 bg-[#466EA1] text-white p-2 rounded-md mx-2 hover:bg-[#1D2E3E] disabled:cursor-not-allowed disabled:hover:bg-[#466EA1]"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div>
          {getPageNumbers(totalPages, currentPage).map((page) => (
            <button
              key={page}
              className={`w-12 text-white p-2 rounded-md mx-2 hover:bg-[#1D2E3E] ${
                currentPage === page ? "bg-[#1D2E3E]" : "bg-[#466EA1]"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          data-testid="next-button"
          className="w-20 bg-[#466EA1] text-white p-2 rounded-md mx-2 hover:bg-[#1D2E3E] disabled:cursor-not-allowed disabled:hover:bg-[#466EA1]"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Pagination;
