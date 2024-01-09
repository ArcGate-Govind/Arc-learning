import React from "react";

const ResultPrePage = ({
  selectedPerPageResult,
  setShowSelectedPerPageResult,
  setCurrentPage,
}) => {
  const handleChangeSelectValue = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      setShowSelectedPerPageResult(selectedValue);
      setCurrentPage(1);
    }
  };
  return (
    <>
      <p className="text-sm font-semibold md:text-base  flex items-center justify-between">
        Results Per Page
      </p>
      <select
        name="resultPerPage"
        className="w-20 p-2  md:w-20 h-10 md:h-10 px-3 bg-[#fff] mx-8 text-[#9CA4B4] border-[#C5C6C8] border rounded-md "
        onChange={handleChangeSelectValue}
        placeholder="Result Per Page"
        value={selectedPerPageResult}
      >
        <option className="text-center" value="10">
          10
        </option>
        <option className="text-center " value="20">
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

export default ResultPrePage;
