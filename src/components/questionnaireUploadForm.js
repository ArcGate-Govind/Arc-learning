"use client";
import React, { useState, useEffect } from "react";
import ModalBox from "./modalBox";
import Image from "next/image";
import questionnaireUpload from "@/image/questionnaireUpload.png";

const QuestionnaireUploadForm = ({ onClose }) => {
  const [uploadAllowed, setUploadAllowed] = useState(false);
  const [assessmentDetails, setAssessmentDetails] = useState({
    title: "",
    question: "",
    options: [""],
    correctAnswers: [],
  });

  useEffect(() => {
    const { options } = assessmentDetails;
    const optionsCount = options.filter((option) => option !== "").length;
    setUploadAllowed(optionsCount >= 4 && optionsCount <= 8);
  }, [assessmentDetails]);

  const handleAddOption = () => {
    const { options } = assessmentDetails;
    if (options.length < 8) {
      setAssessmentDetails({
        ...assessmentDetails,
        options: [...options, ""],
      });
    }
  };

  const handleTitleChange = (event) => {
    setAssessmentDetails({
      ...assessmentDetails,
      title: event.target.value,
    });
  };

  const handleQuestionChange = (event) => {
    setAssessmentDetails({
      ...assessmentDetails,
      question: event.target.value,
    });
  };

  const handleOptionChange = (index, value) => {
    const { options } = assessmentDetails;
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setAssessmentDetails({
      ...assessmentDetails,
      options: updatedOptions,
    });
  };

  const handleDeleteOption = (index) => {
    const { options } = assessmentDetails;
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setAssessmentDetails({
      ...assessmentDetails,
      options: updatedOptions,
    });
  };

  const handleUpload = () => {
    localStorage.setItem(
      "assessmentDetails",
      JSON.stringify(assessmentDetails)
    );
  };

  const handleCorrectAnswerChange = (value) => {
    const { correctAnswers } = assessmentDetails;
    const updatedCorrectAnswers = [...correctAnswers];

    if (updatedCorrectAnswers.includes(value)) {
      const indexToRemove = updatedCorrectAnswers.indexOf(value);
      updatedCorrectAnswers.splice(indexToRemove, 1);
    } else {
      updatedCorrectAnswers.push(value);
    }

    setAssessmentDetails({
      ...assessmentDetails,
      correctAnswers: updatedCorrectAnswers,
    });
  };

  return (
    <ModalBox onClose={onClose}>
      <div className="container mx-auto p-5">
        <div className="max-w-md mx-auto bg-[#F8F8F8] p-6 rounded-md shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Upload Question
            </h2>
            <Image
              src={questionnaireUpload}
              alt="videoUpload"
              className="w-12 md:w-16 pt-1"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-semibold mb-1"
            >
              Assessment Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Assessment Title"
              className="w-full py-2 px-3 shadow-md"
              value={assessmentDetails.title}
              onChange={handleTitleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="question"
              className="block text-gray-700 font-semibold mb-1"
            >
              Question:
            </label>
            <input
              type="text"
              id="question"
              name="question"
              placeholder="Question"
              className="w-full py-2 px-3 shadow-md"
              value={assessmentDetails.question}
              onChange={handleQuestionChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="options"
              className="block text-gray-700 font-semibold mb-1"
            >
              Options:
            </label>
            {assessmentDetails.options.map((option, index) => (
              <div key={index} className="mb-2 flex">
                <input
                  type="checkbox"
                  id={`option-${index}`}
                  checked={assessmentDetails.correctAnswers.includes(option)}
                  onChange={() => handleCorrectAnswerChange(option)}
                  className="mr-2"
                />
                <input
                  type="text"
                  id={`option-${index}`}
                  name={`option-${index}`}
                  placeholder="Option"
                  className="w-full py-2 px-3 shadow-md"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                {index === assessmentDetails.options.length - 1 &&
                  assessmentDetails.options.length < 8 && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="bg-gray-300 text-gray-700 px-3 font-bold font-2xl rounded-md cursor-pointer hover:bg-gray-400 ml-2"
                    >
                      +
                    </button>
                  )}
                {index !== assessmentDetails.options.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(index)}
                    className="mx-2 p-2 text-center text-red-500 font-bold font-2xl"
                  >
                    X
                  </button>
                )}
                {index === assessmentDetails.options.length - 1 &&
                  assessmentDetails.options.length === 8 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(index)}
                      className="mx-2 p-2 text-center text-red-500 font-bold font-2xl"
                    >
                      X
                    </button>
                  )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-[#466EA1] text-white py-2 px-4 rounded-md cursor-pointer hover:bg-gray-200 hover:text-[#466EA1] ${
                !uploadAllowed && "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleUpload}
              disabled={!uploadAllowed}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </ModalBox>
  );
};

export default QuestionnaireUploadForm;
