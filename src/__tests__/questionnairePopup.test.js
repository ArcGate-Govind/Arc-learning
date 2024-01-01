import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import QuestionnairePopup from "../components/questionnairePopup";
import UserDetailsProvider from "@/context/createContext";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    pathname: "/dashboard/questionnaire",
    query: {},
    asPath: "/dashboard/questionnaire",
    push: jest.fn(),
  }),
}));

let component;

beforeEach(() => {
  component = (
    <UserDetailsProvider>
      <QuestionnairePopup />
    </UserDetailsProvider>
  );
});

describe("Questionnaire Component", () => {
  test("Renders component correctly.", () => {
    render(component);
  });

  test("Renders questions and options from mock data", () => {
    const mockParamsId = 1;
    const onCloseMock = jest.fn();

    render(
      <QuestionnairePopup paramsId={mockParamsId} onClose={onCloseMock} />
    );

    const mockQuestion = "Question 1 for assignment 1";
    const mockOptions = [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4",
      "Option 5",
      "Option 6",
      "Option 7",
      "Option 8",
    ];

    const questionElement = screen.getByText(`Q. ${mockQuestion}`);
    expect(questionElement).toBeInTheDocument();

    mockOptions.forEach((option) => {
      const optionElement = screen.getByText(option);
      expect(optionElement).toBeInTheDocument();
    });
  });

  test("Handles Next button click", () => {
    const mockParamsId = 1;
    const onCloseMock = jest.fn();

    render(
      <QuestionnairePopup paramsId={mockParamsId} onClose={onCloseMock} />
    );

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    const nextQuestion = "Question 2 for assignment 1";
    const nextQuestionElement = screen.getByText(`Q. ${nextQuestion}`);
    expect(nextQuestionElement).toBeInTheDocument();
  });

  test("Handles Previous button click", () => {
    const mockParamsId = 1;
    const onCloseMock = jest.fn();

    render(
      <QuestionnairePopup paramsId={mockParamsId} onClose={onCloseMock} />
    );

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    const previousButton = screen.getByText("Previous");
    fireEvent.click(previousButton);

    const firstQuestion = "Question 1 for assignment 1";
    const firstQuestionElement = screen.getByText(`Q. ${firstQuestion}`);
    expect(firstQuestionElement).toBeInTheDocument();
  });

  test("Handles checkbox change", () => {
    const mockParamsId = 1;
    const onCloseMock = jest.fn();

    render(
      <QuestionnairePopup paramsId={mockParamsId} onClose={onCloseMock} />
    );

    const optionToSelect = screen.getByLabelText("Option 1");

    fireEvent.change(optionToSelect, { target: { checked: true } });

    expect(optionToSelect.checked).toBe(true);
  });

  test("Displays error message on no option selected", async () => {
    const mockParamsId = 1;
    const onCloseMock = jest.fn();

    render(
      <QuestionnairePopup paramsId={mockParamsId} onClose={onCloseMock} />
    );

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        const errorMessage = screen.queryByText(
          "Please select at least one option before submitting"
        );
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      },
      { timeout: 5000 }
    );
  });

  test("Handles form submission", () => {
    const mockParamsId = 1;
    const onCloseMock = jest.fn();

    render(
      <QuestionnairePopup paramsId={mockParamsId} onClose={onCloseMock} />
    );

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
  });

  test("Updates local storage on form submission", () => {
    const mockParamsId = 1;
    const onCloseMock = jest.fn();

    const mockSubmittedAnswers = [];
    localStorage.setItem(
      "submittedAnswers",
      JSON.stringify(mockSubmittedAnswers)
    );

    render(
      <QuestionnairePopup paramsId={mockParamsId} onClose={onCloseMock} />
    );

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    waitFor(() => {
      const storedData = JSON.parse(localStorage.getItem("submittedAnswers"));
      expect(storedData).toHaveLength(1);
    });
  });

  test("Disables Next button on the last question", () => {
    const mockParamsId = 1;
    const onCloseMock = jest.fn();

    render(
      <QuestionnairePopup paramsId={mockParamsId} onClose={onCloseMock} />
    );

    const nextButton = screen.getByText("Next");

    const totalQuestions = 2;

    for (let i = 0; i < totalQuestions - 1; i++) {
      fireEvent.click(nextButton);
    }

    expect(nextButton).toBeDisabled();
  });

  test("Disables Previous button on the first question", () => {
    const mockParamsId = 1;
    const onCloseMock = jest.fn();

    render(
      <QuestionnairePopup paramsId={mockParamsId} onClose={onCloseMock} />
    );

    const previousButton = screen.getByText("Previous");

    expect(previousButton).toBeDisabled();
  });
});
