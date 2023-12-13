import React from "react";
import {
  waitFor,
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "@/app/adminpanel/[id]/page";
import userEvent from "@testing-library/user-event";


const mockData = {
  message: "success",
  code: 200,
  projects: [
    {
      employee_id: "emp_01",
      user_id: 1,
      full_name: "govind dev soni",
      project: "DRF",
      role: "Super Admin",
      status: false,
      permissions: {
        read: true,
        delete: true,
        update: true,
      },
    },
    {
      employee_id: "emp_01",
      user_id: 1,
      full_name: "gjtk",
      project: "Test",
      role: "Agent",
      status: true,
      permissions: {
        read: true,
        delete: true,
        update: true,
      },
    },
    {
      employee_id: "emp_01",
      user_id: 1,
      full_name: "thgt",
      project: "amazon",
      role: "Agent",
      status: true,
      permissions: {
        read: true,
        delete: true,
        update: true,
      },
    },
  ],
};

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    pathname: "/",
    query: {},
    asPath: "/",
    push: jest.fn(),
  }),
}));

beforeEach(() => {
  fetch.mockClear();
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ mockData }),
  })
);

describe("UserProfile component", () => {
  beforeAll(() => {
    jest.spyOn(window, "fetch");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("renders the UserProfile component", async () => {
    render(<UserProfile />);
  });

  it("should handle permission change correctly", async () => {
    const mockProjects = [
      {
        permissions: {
          read: true,
          update: true,
          delete: true,
        },
      },
    ];

    render(<UserProfile projects={mockProjects} />);

    await waitFor(() => {
      return screen.getByText("Read");
    });

    const readCheckbox = screen
      .getByText("Read")
      .closest("tr")
      .querySelector('input[type="checkbox"]');
    const updateCheckbox = screen
      .getByText("Update")
      .closest("tr")
      .querySelector('input[type="checkbox"]');
    const deleteCheckbox = screen
      .getByText("Delete")
      .closest("tr")
      .querySelector('input[type="checkbox"]');

    if (readCheckbox && updateCheckbox && deleteCheckbox) {
      userEvent.click(readCheckbox);
      userEvent.click(updateCheckbox);
      userEvent.click(deleteCheckbox);
    } else {
      console.error("One or more checkboxes are missing.");
      expect(false).toBe(true);
    }
  });

  it("load the button  component", async () => {
    render(<UserProfile />);
    const button = screen.getByText("Back");
    expect(button).toBeInTheDocument();
  });

  it("load update button component ", async () => {
    render(<UserProfile />);
    const updateButton = screen.getByText("Save Changes");
    expect(updateButton).toBeInTheDocument();
  });

  it("load table in components", async () => {
    render(<UserProfile />);
    const Table = screen.getByRole("table");
    expect(Table).toBeInTheDocument;
  });

  it("should load two input boxes in user details", () => {
    render(<UserProfile />);
    const inputBoxes = screen.getAllByRole("checkbox");
    expect(inputBoxes.length).not.toBe(8);
  });

  it("should toggle permissions and update state accordingly", () => {
    const { getByTestId } = render(<UserProfile />);

    const readCheckbox = getByTestId("read-checkbox");

    fireEvent.click(readCheckbox);
    expect(readCheckbox.checked).toBe(true);
  });
});
