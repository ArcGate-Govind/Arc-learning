import React from "react";

// ResultPerPage component for selecting the number of results per page
const ResultPerPage = ({
  selectedPerPageResult, // Currently selected results per page value
  setShowSelectedPerPageResult, // Function to set the selected results per page
  setCurrentPage, // Function to set the current page
}) => {
  // Handle change in the selected results per page value
  const handleChangeSelectValue = (event) => {
    const selectedValue = event.target.value;

    // Update the selected results per page value and reset to the first page
    if (selectedValue) {
      setShowSelectedPerPageResult(selectedValue);
      setCurrentPage(1);
    }
  };

  // Render the UI for selecting results per page
  return (
    <>
      {/* Display the label for results per page */}
      <p className="text-sm font-semibold md:text-base flex items-center justify-between">
        Results Per Page
      </p>

      {/* Dropdown to select the number of results per page */}
      <select
        name="resultPerPage"
        className="w-20 p-2 md:w-20 h-10 md:h-10 px-3 bg-[#fff] mx-8 text-[#9CA4B4] border-[#C5C6C8] border rounded-md"
        onChange={handleChangeSelectValue}
        placeholder="Result Per Page"
        value={selectedPerPageResult}
      >
        {/* Options for selecting results per page */}
        <option className="text-center" value="10">
          10
        </option>
        <option className="text-center" value="20">
          20
        </option>
        <option className="text-center" value="30">
          30
        </option>
        <option className="text-center" value="50">
          50
        </option>
      </select>
    </>
  );
};

export default ResultPerPage;
