"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Previous from "@/image/left-arrow.png";
import Next from "@/image/next.png";
import ModalBox from "./modalBox";
import { NO_OPTIONS_SELECTED_MESSAGE } from "../../message";

const Questions = ({ paramsId, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [optionStatus, setOptionStatus] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const questionnaireData = [
    {
      id: 1,
      assignment: [
        {
          id: 1,
          question: "Question 1 for assignment 1",
          correctOptions: [
            { id: 2, label: "Option 2" },
            { id: 4, label: "Option 4" },
            { id: 7, label: "Option 7" },
          ],
          options: [
            { id: 1, label: "Option 1" },
            { id: 2, label: "Option 2" },
            { id: 3, label: "Option 3" },
            { id: 4, label: "Option 4" },
            { id: 5, label: "Option 5" },
            { id: 6, label: "Option 6" },
            { id: 7, label: "Option 7" },
            { id: 8, label: "Option 8" },
          ],
        },
        {
          id: 2,
          question: "Question 2 for assignment 1",
          correctOptions: [
            { id: 1, label: "Option 1" },
            { id: 5, label: "Option 5" },
          ],
          options: [
            { id: 1, label: "Option 1" },
            { id: 2, label: "Option 2" },
            { id: 3, label: "Option 3" },
            { id: 4, label: "Option 4" },
            { id: 5, label: "Option 5" },
            { id: 6, label: "Option 6" },
            { id: 7, label: "Option 7" },
            { id: 8, label: "Option 8" },
          ],
        },
      ],
    },
    {
      id: 2,
      assignment: [
        {
          id: 1,
          question: "Question 1 for assignment 2",
          correctOptions: [
            { id: 2, label: "Option 2" },
            { id: 3, label: "Option 3" },
          ],
          options: [
            { id: 1, label: "Option 1" },
            { id: 2, label: "Option 2" },
            { id: 3, label: "Option 3" },
            { id: 4, label: "Option 4" },
            { id: 5, label: "Option 5" },
            { id: 6, label: "Option 6" },
            { id: 7, label: "Option 7" },
            { id: 8, label: "Option 8" },
          ],
        },
        {
          id: 2,
          question: "Question 2 for assignment 2",
          correctOptions: [
            { id: 4, label: "Option 4" },
            { id: 8, label: "Option 8" },
          ],
          options: [
            { id: 1, label: "Option 1" },
            { id: 2, label: "Option 2" },
            { id: 3, label: "Option 3" },
            { id: 4, label: "Option 4" },
            { id: 5, label: "Option 5" },
            { id: 6, label: "Option 6" },
            { id: 7, label: "Option 7" },
            { id: 8, label: "Option 8" },
          ],
        },
      ],
    },
    {
      id: 3,
      assignment: [
        {
          id: 1,
          question: "Question 1 for assignment 3",
          correctOptions: [7],
          options: [
            { id: 1, label: "Option 1" },
            { id: 2, label: "Option 2" },
            { id: 3, label: "Option 3" },
            { id: 4, label: "Option 4" },
            { id: 5, label: "Option 5" },
            { id: 6, label: "Option 6" },
            { id: 7, label: "Option 7" },
            { id: 8, label: "Option 8" },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    if (paramsId && questions.length === 0) {
      const filteredData = questionnaireData.find(
        (data) => data.id === parseInt(paramsId)
      );

      if (filteredData) {
        setQuestions(filteredData.assignment);
      }
    }
  }, [paramsId, questions.length, questionnaireData]);

  useEffect(() => {
    if (paramsId && questions.length > 0) {
      const currentAssignmentId = parseInt(paramsId);
      const currentQuestionId = questions[currentQuestionIndex].id;
      const submittedAnswers =
        JSON.parse(localStorage.getItem("submittedAnswers")) || [];

      const savedAnswer = submittedAnswers.find(
        (answer) =>
          answer.assignmentId === currentAssignmentId &&
          answer.questionId === currentQuestionId
      );

      if (savedAnswer && !submitted) {
        setSelectedOptions(savedAnswer.selectedOptions);
        setOptionStatus(savedAnswer.optionStatus);
        setSubmitted(true);
      } else if (!savedAnswer && submitted) {
        setSelectedOptions([]);
        setOptionStatus({});
        setSubmitted(false);
      }
    }
  }, [paramsId, currentQuestionIndex, questions, submitted]);

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < questionnaireData.length - 1 ? prevIndex + 1 : prevIndex
    );
    setSelectedOptions([]);
    setOptionStatus({});
    setSubmitted(false);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
    setSelectedOptions([]);
    setOptionStatus({});
    setSubmitted(false);
  };

  const handleCheckboxChange = (option) => {
    if (!submitted) {
      if (selectedOptions.includes(option.id)) {
        setSelectedOptions((prevSelected) =>
          prevSelected.filter((selected) => selected !== option.id)
        );
      } else {
        setSelectedOptions((prevSelected) => [...prevSelected, option.id]);
      }
    }
  };

  const handleSubmit = () => {
    const currentAssignmentId = parseInt(paramsId);
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptionIds = selectedOptions;
    const correctOptions = currentQuestion.correctOptions.map(
      (option) => option.id
    );

    if (selectedOptionIds.length > 0) {
      const newOptionStatus = {};
      currentQuestion.options.forEach((option) => {
        newOptionStatus[option.id] =
          selectedOptionIds.includes(option.id) &&
          correctOptions.includes(option.id)
            ? "correct"
            : selectedOptionIds.includes(option.id)
            ? "incorrect"
            : "default";
      });

      const submittedAnswers = {
        assignmentId: currentAssignmentId,
        questionId: currentQuestion.id,
        selectedOptions: selectedOptionIds,
        optionStatus: newOptionStatus,
      };

      const previousSubmissions =
        JSON.parse(localStorage.getItem("submittedAnswers")) || [];

      const updatedSubmissions = [...previousSubmissions, submittedAnswers];

      localStorage.setItem(
        "submittedAnswers",
        JSON.stringify(updatedSubmissions)
      );

      setOptionStatus(newOptionStatus);
      setSubmitted(true);
      setErrorMessage("");
    } else {
      setErrorMessage(NO_OPTIONS_SELECTED_MESSAGE);
    }
  };

  return (
    <ModalBox onClose={onClose}>
      <div className="relative flex">
        {questions.length > 0 && (
          <div className="flex flex-col items-center justify-center mt-10 w-full">
            <div className="bg-[#F8F8F8] w-full md:w-3/4 md:mx-auto mx-5">
              <div>
                <h1 className="text-xl text-center pt-4 mb-5">{`Q. ${questions[currentQuestionIndex].question}`}</h1>
                <div className="bg-[#F8F8F8] mx-auto mt-1 pb-5">
                  <div className="grid grid-cols-2 gap-5 mx-10 mt-1">
                    {questions[currentQuestionIndex].options.map((option) => (
                      <div
                        key={option.id}
                        className={`py-3 px-3 rounded-lg ${
                          optionStatus[option.id] === "correct"
                            ? "bg-green-200"
                            : optionStatus[option.id] === "incorrect"
                            ? "bg-red-200"
                            : selectedOptions.includes(option.id)
                            ? "bg-white"
                            : "bg-white"
                        }`}
                      >
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          id={`option${option.id}`}
                          name={`option${option.id}`}
                          value={`option${option.id}`}
                          onChange={() => handleCheckboxChange(option)}
                          checked={selectedOptions.includes(option.id)}
                        />
                        <label
                          className="ml-4 cursor-pointer"
                          htmlFor={`option${option.id}`}
                        >
                          {`${option.label}`}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#F8F8F8] flex justify-between items-center w-full md:w-1/2 p-4 mt-10">
              <button
                type="button"
                className={`text-lg flex items-center ${
                  currentQuestionIndex === 0
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:text-[#466EA1] hover:underline"
                }`}
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <Image src={Previous} alt="Previous" className="w-5" />
                Previous
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-[#466EA1] text-[#FFFFFF] py-1 px-3 rounded-md border-0 hover:bg-[#F8F8F8] hover:text-[#466EA1] hover:border-2 hover:border-[#466EA1]"
              >
                Submit
              </button>
              <button
                type="button"
                className={`text-lg flex items-center ${
                  currentQuestionIndex === questions.length - 1
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:text-[#466EA1] hover:underline"
                }`}
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
                <Image src={Next} alt="Next" className="w-5" />
              </button>
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        )}
        {questions.length === 0 && (
          <div className="flex justify-center w-full mt-5">
            <p className="text-center text-xl">Loading...</p>
          </div>
        )}
      </div>
    </ModalBox>
  );
};

export default Questions;

