import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Questionnaire from "@/app/dashboard/questionnaire/page";
import UserDetailsProvider from "@/context/createContext";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    pathname: "/dashboard/questionnaire",
    query: {},
    asPath: "/dashboard/questionnaire",
    push: jest.fn(),
  }),
}));

jest.mock("next/image", () => {
  return {
    __esModule: true,
    default: function Image({ src, alt }) {
      return <img src={src} alt={alt} />;
    },
  };
});

let component;

beforeEach(() => {
  component = (
    <UserDetailsProvider>
      <Questionnaire />
    </UserDetailsProvider>
  );
});

const mockData = [
  { id: 1, title: "Assessment-1" },
  { id: 2, title: "Assessment-2" },
];

describe("Questionnaire Component", () => {
  test("Renders component correctly.", () => {
    render(component);
  });

  test("Form submission without input shows error", () => {
    const { getByText } = render(component);
    const searchButton = getByText("Search");
    fireEvent.click(searchButton);
    const errorMessage = getByText("Please fill in search box.");
    expect(errorMessage).toBeInTheDocument();
  });

  test("Renders items from mock data", () => {
    const { getByText } = render(component);
    mockData.forEach((item) => {
      const element = getByText(item.title);
      expect(element).toBeInTheDocument();
    });
  });

  test("Clear button clears the form", () => {
    const { getByText, getByPlaceholderText } = render(component);
    const searchInput = getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Test search" } });
    const searchButton = getByText("Search");
    fireEvent.click(searchButton);
    expect(localStorage.getItem("questionnaireSearchValue")).toBe(
      "Test search"
    );
    const clearButton = getByText("Clear");
    fireEvent.click(clearButton);
    expect(localStorage.getItem("questionnaireSearchValue")).toBe(null);
    expect(searchInput.value).toBe("");
  });
});
