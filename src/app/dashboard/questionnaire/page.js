"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import questionnaireLogo from "@/image/questionnaire.png";
import Questions from "@/components/questionnairePopup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SEARCH_INPUT_MESSAGE } from "../../../../message";
import AOS from "aos";
import "aos/dist/aos.css";

const Questionnaire = () => {
  const [params, setParams] = useState();
  const [popupOpen, setPopupOpen] = useState(false);
  const [blankInputError, setBlankInputError] = useState(false);
  const [searchClear, setSearchClear] = useState(false);

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

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 600,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const openPopup = (id) => {
    setParams(id);
    setPopupOpen(true);
  };

  const onClose = () => {
    setPopupOpen(false);
  };

  const handleFormSubmit = () => {
    if (!formik.values.assessmentSearch) {
      setBlankInputError(true);
    } else {
      setBlankInputError(false);
      localStorage.setItem(
        "questionnaireSearchValue",
        formik.values.assessmentSearch
      );
    }
  };

  useEffect(() => {
    const storedSearchValue = localStorage.getItem("questionnaireSearchValue");
    if (storedSearchValue) {
      formik.setValues({
        ...formik.values,
        assessmentSearch: storedSearchValue,
      });
    }
  }, []);

  const handleFormClear = () => {
    setSearchClear(true);
    setBlankInputError(false);
    formik.setValues({ ...formik.values, assessmentSearch: "" });
    localStorage.removeItem("questionnaireSearchValue");
  };

  const validationSchema = Yup.object().shape({
    assessmentSearch: Yup.string().required(SEARCH_INPUT_MESSAGE),
  });

  const formik = useFormik({
    initialValues: {
      question: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values.assessmentSearch);
    },
  });

  return (
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
            type="button"
            onClick={handleFormSubmit}
            className="p-2 bg-[#466EA1] text-[#FFFFFF] rounded cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleFormClear}
            className="p-2 bg-[#466EA1] text-[#FFFFFF] rounded cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
          >
            Clear
          </button>
        </div>
        {blankInputError && (
          <div className="text-red-500 text-center">{SEARCH_INPUT_MESSAGE}</div>
        )}
      </form>
      <div className="grid grid-cols-5 gap-4 justify-items-center mt-10">
        {questionnaireData.map((item) => (
          <div
            data-aos="fade-up"
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
      {popupOpen && <Questions paramsId={params} onClose={onClose} />}
    </div>
  );
};

export default Questionnaire;
