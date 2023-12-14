"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Previous from "@/image/left-arrow.png";
import Next from "@/image/next.png";

const Questions = ({ params }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [optionStatus, setOptionStatus] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
            { id: 1, label: "Option 1", checked: false },
            { id: 2, label: "Option 2", checked: false },
            { id: 3, label: "Option 3", checked: false },
            { id: 4, label: "Option 4", checked: false },
            { id: 5, label: "Option 5", checked: false },
            { id: 6, label: "Option 6", checked: false },
            { id: 7, label: "Option 7", checked: false },
            { id: 8, label: "Option 8", checked: false },
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
            { id: 1, label: "Option 1", checked: false },
            { id: 2, label: "Option 2", checked: false },
            { id: 3, label: "Option 3", checked: false },
            { id: 4, label: "Option 4", checked: false },
            { id: 5, label: "Option 5", checked: false },
            { id: 6, label: "Option 6", checked: false },
            { id: 7, label: "Option 7", checked: false },
            { id: 8, label: "Option 8", checked: false },
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
            { id: 1, label: "Option 1", checked: false },
            { id: 2, label: "Option 2", checked: false },
            { id: 3, label: "Option 3", checked: false },
            { id: 4, label: "Option 4", checked: false },
            { id: 5, label: "Option 5", checked: false },
            { id: 6, label: "Option 6", checked: false },
            { id: 7, label: "Option 7", checked: false },
            { id: 8, label: "Option 8", checked: false },
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
            { id: 1, label: "Option 1", checked: false },
            { id: 2, label: "Option 2", checked: false },
            { id: 3, label: "Option 3", checked: false },
            { id: 4, label: "Option 4", checked: false },
            { id: 5, label: "Option 5", checked: false },
            { id: 6, label: "Option 6", checked: false },
            { id: 7, label: "Option 7", checked: false },
            { id: 8, label: "Option 8", checked: false },
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
            { id: 1, label: "Option 1", checked: false },
            { id: 2, label: "Option 2", checked: false },
            { id: 3, label: "Option 3", checked: false },
            { id: 4, label: "Option 4", checked: false },
            { id: 5, label: "Option 5", checked: false },
            { id: 6, label: "Option 6", checked: false },
            { id: 7, label: "Option 7", checked: false },
            { id: 8, label: "Option 8", checked: false },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    if (params.id && questions.length === 0) {
      const filteredData = questionnaireData.find(
        (data) => data.id === parseInt(params.id)
      );

      if (filteredData) {
        setQuestions(filteredData.assignment);
      }
    }
  }, [params.id, questions.length, questionnaireData]);

  useEffect(() => {
    if (params.id && questions.length > 0) {
      const currentQuestionId = questions[currentQuestionIndex].id;
      const submittedAnswers =
        JSON.parse(localStorage.getItem("submittedAnswers")) || [];
      const savedAnswer = submittedAnswers.find(
        (answer) => answer.questionId === currentQuestionId
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
  }, [params.id, currentQuestionIndex, questions, submitted]);

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
      } else if (selectedOptions.length < 3) {
        setSelectedOptions((prevSelected) => [...prevSelected, option.id]);
      }
    }
  };

  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptionIds = selectedOptions;
    const correctOptions = currentQuestion.correctOptions.map(
      (option) => option.id
    );

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
      questionId: questions[currentQuestionIndex].id,
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
  };

  return (
    <div className="relative flex">
      {questions.length > 0 && (
        <div className="flex flex-col items-center justify-center mt-10 w-full">
          <div className="bg-[#F8F8F8] md:w-1/2 md:mx-auto mx-5">
            <div>
              <h1 className="text-xl text-center pt-4">{`Q. ${questions[currentQuestionIndex].question}`}</h1>
              <h3 className="text-right mx-10 mt-3 mb-1">
                Select up to 3 options
              </h3>
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
                        disabled={
                          selectedOptions.length === 3 &&
                          !selectedOptions.includes(option.id)
                        }
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
        </div>
      )}
      {questions.length === 0 && (
        <div className="flex justify-center w-full mt-5">
          <p className="text-center text-xl">
            Loading...
          </p>
        </div>
      )}
    </div>
  );
};

export default Questions;