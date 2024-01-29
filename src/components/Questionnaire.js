"use client";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import questionnaireLogo from "@/image/questionnaire.png";
import Questions from "@/components/questionnairePopup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SEARCH_INPUT_MESSAGE } from "../../message";
import AOSWrapper from "@/components/aosWrapper";
import Dashboard from "./dashboard";
import ResultPerPage from "./resultPerPage";
import { userDetailsContext } from "@/context/createContext";
import Pagination from "./pagination";

const Questionnaire = () => {
  // Destructuring context values
  const {
    selectedQuestionnaireSearchValuesContext,
    questionnaireCurrentPageContext,
    selectedPerPageResultContext,
    selectedProjectContext,
  } = useContext(userDetailsContext);

  // Extracting values from context
  const [
    selectedQuestionnaireSearchValues,
    setShowSelectedQuestionnaireSearchValues,
  ] = selectedQuestionnaireSearchValuesContext;
  const [questionnaireCurrentPage, setQuestionnaireCurrentPage] =
    questionnaireCurrentPageContext;
  const [selectedPerPageResult, setShowSelectedPerPageResult] =
    selectedPerPageResultContext;
  const [selectedProject, setShowSelectedProject] = selectedProjectContext;

  const [params, setParams] = useState();
  const [popupOpen, setPopupOpen] = useState(false);
  const [blankInputError, setBlankInputError] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [
    questionnaireCurrentPage,
    selectedQuestionnaireSearchValues,
    selectedPerPageResult,
  ]);

  const questionnaireData = [
    { id: 1, title: "Assessment-1" },
    { id: 2, title: "Assessment-2" },
    { id: 3, title: "Assessment-3" },
    { id: 4, title: "Assessment-4" },
    { id: 5, title: "Assessment-5" },
    { id: 6, title: "Assessment-6" },
    { id: 7, title: "Assessment-7" },
    { id: 8, title: "Assessment-8" },
    { id: 9, title: "Assessment-9" },
    { id: 10, title: "Assessment-10" },
    { id: 11, title: "Assessment-11" },
    { id: 12, title: "Assessment-12" },
    { id: 13, title: "Assessment-13" },
    { id: 14, title: "Assessment-14" },
    { id: 15, title: "Assessment-15" },
  ];

  const openPopup = (id) => {
    setParams(id);
    setPopupOpen(true);
  };

  const onClose = () => {
    setPopupOpen(false);
  };

  const fetchData = async () => {
    const queryParams = [];

    if (selectedQuestionnaireSearchValues != null) {
      if (selectedQuestionnaireSearchValues.assessmentSearch) {
        queryParams.push(
          `assessmentSearch=${selectedQuestionnaireSearchValues.assessmentSearch}`
        );
      }
    }

    queryParams.push(`project=${selectedProject}`);
    queryParams.push(`page_size=${selectedPerPageResult}`);
    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    const newUrl = `${window.location.pathname}${queryString}&questionnairePage=${questionnaireCurrentPage}`;
    window.history.replaceState({}, "", newUrl);

    setTotalPages(3);
  };

  const handleFormSubmit = () => {
    if (!formik.values.assessmentSearch) {
      setBlankInputError(true);
    } else {
      setBlankInputError(false);
      setQuestionnaireCurrentPage(1);
    }
  };

  // Function to handle form clear
  const handleFormClear = () => {
    setSearchClear(true);
    const newUrl = `${window.location.pathname}?project=${selectedProject}&questionnairePage=${questionnaireCurrentPage}`;
    window.history.replaceState({}, "", newUrl);
    window.location.reload();
  };

  const validationSchema = Yup.object().shape({
    assessmentSearch: Yup.string().required(SEARCH_INPUT_MESSAGE),
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      assessmentSearch: selectedQuestionnaireSearchValues.assessmentSearch,
    },
    validationSchema,
    onSubmit: (values) => {
      const trimedValue = {
        assessmentSearch: values.assessmentSearch.trim(),
      };
      if (trimedValue.assessmentSearch != "") {
        setShowSelectedQuestionnaireSearchValues(trimedValue);
      }
      if (searchClear) {
        setBlankInputError(false);
      } else if (!trimedValue.assessmentSearch && !searchClear) {
        setBlankInputError(true);
      } else {
        setBlankInputError(false);
      }
    },
  });

  return (
    <AOSWrapper>
      <Dashboard />
      <div className="mx-5 md:mx-10 my-10 bg-[#F8F8F8] p-4">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex justify-center gap-x-3">
            <input
              type="text"
              name="assessmentSearch"
              className="w-1/2 md:w-1/4 rounded px-5 border-2 border-gray-200"
              placeholder="Search"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.assessmentSearch}
            />
            <button
              type="submit"
              onClick={handleFormSubmit}
              className="p-2 bg-[#466EA1] text-[#FFFFFF] rounded cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
            >
              Search
            </button>
            <button
              type="submit"
              onClick={handleFormClear}
              className="p-2 bg-[#466EA1] text-[#FFFFFF] rounded cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
            >
              Clear
            </button>

            <ResultPerPage
              setShowSelectedPerPageResult={setShowSelectedPerPageResult}
              selectedPerPageResult={selectedPerPageResult}
              setCurrentPage={setQuestionnaireCurrentPage}
            />
          </div>
          {blankInputError && (
            <div className="text-red-500 text-center">
              {SEARCH_INPUT_MESSAGE}
            </div>
          )}
        </form>
        <div className="grid grid-cols-5 gap-4 justify-items-center mt-10">
          {questionnaireData.map((item) => (
            <div
              data-aos="fade-up"
              data-aos-duration="1400"
              onClick={() => openPopup(item.id)}
              key={item.id}
              className="bg-[#FFFFFF] p-3 cursor-pointer hover:shadow-lg md:w-40 md:h-40 flex flex-col items-center justify-center"
            >
              <Image
                src={questionnaireLogo}
                alt="LogoutImage"
                className="w-16 md:w-20 mx-auto pt-1"
              />
              <h2 className="text-center font-semibold p-1 text-sm md:text-lg">
                {item.title}
              </h2>
            </div>
          ))}
        </div>

        {/* Display pagination if there are multiple pages */}
        {questionnaireData.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={questionnaireCurrentPage}
            setCurrentPage={setQuestionnaireCurrentPage}
            totalPages={totalPages}
            isConfirmModal={true}
          />
        )}
        {popupOpen && <Questions paramsId={params} onClose={onClose} />}
      </div>
    </AOSWrapper>
  );
};

export default Questionnaire;
