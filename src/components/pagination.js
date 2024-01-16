import React from "react";

// Pagination component for handling navigation between pages
const Pagination = ({
  currentPage, // Current page number
  setCurrentPage, // Function to set the current page
  totalPages, // Total number of pages
  unsavedChanges, // Flag indicating unsaved changes
  isConfirmModal, // Flag indicating the presence of a confirmation modal
}) => {
  // Handle previous page button click
  const handlePrevPage = () => {
    // Check for unsaved changes, prompt a modal if true
    if (unsavedChanges) {
      setIsOpenModal(true); // Assuming setIsOpenModal is defined elsewhere
    } else if (isConfirmModal && currentPage > 1) {
      // Move to the previous page if not at the first page
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page button click
  const handleNextPage = () => {
    // Check for unsaved changes, prompt a modal if true
    if (unsavedChanges) {
      setIsOpenModal(true); // Assuming setIsOpenModal is defined elsewhere
    } else if (isConfirmModal && currentPage < totalPages) {
      // Move to the next page if not at the last page
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate an array of page numbers based on the current page and total pages
  const getPageNumbers = (totalPages, currentPage) => {
    const maxVisiblePages = 3;
    const pageNumbers = [];

    // Calculate start and end page numbers for the visible pages
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjustments for cases where total pages are less than or equal to maxVisiblePages
    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Populate the array with the calculated page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Render the pagination UI
  return (
    <>
      <div className="flex justify-center mt-8">
        {/* Previous page button */}
        <button
          data-testid="previous-button"
          className="w-20 bg-[#466EA1] text-white p-2 rounded-md mx-2 hover:bg-[#1D2E3E] disabled:cursor-not-allowed disabled:hover:bg-[#466EA1]"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {/* Display page number buttons */}
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

        {/* Next page button */}
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
