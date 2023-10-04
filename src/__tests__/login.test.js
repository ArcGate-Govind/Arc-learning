import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../src/app/page";

// Mock the useRouter function
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    pathname: "/",
    query: {},
    asPath: "/",
    push: jest.fn(),
  }),
}));

// Mock fetch function
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test("renders the Login component with login error", async () => {
  jest.setTimeout(15000); // Increased the timeout to 15 seconds

  render(<Login />);

  const emailInput = await screen.findByLabelText("Username");
  const passwordInput = await screen.findByLabelText("Password");

  fireEvent.change(emailInput, { target: { value: "admin" } });
  fireEvent.change(passwordInput, { target: { value: "Admin@12" } });

  // Mock API response with login error
  fetch.mockRejectedValueOnce({});

  const submitButton = screen.getByText("Login");
  fireEvent.click(submitButton);

  await waitFor(() => {
    const errorPopup = screen.getByText("login message fail", { exact: false });
    expect(errorPopup).toBeInTheDocument();
  });
});

test("renders the Login component Successfully", async () => {
  jest.setTimeout(15000);

  render(<Login />);

  const emailInput = await screen.findByLabelText("Username");
  const passwordInput = await screen.findByLabelText("Password");

  fireEvent.change(emailInput, { target: { value: "admin" } });
  fireEvent.change(passwordInput, { target: { value: "Admin@12" } });

  // Mock successful API response
  fetch.mockResolvedValueOnce({
    json: () =>
      Promise.resolve({
        token: {
          message: "Login Successfully!",
          refresh:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5NjQxNzM1NCwiaWF0IjoxNjk2MzMwOTU0LCJqdGkiOiIwMTYwYzgzYWQyMjk0MDNhODNjYjBhM2RlNDEzOTc4MCIsInVzZXJfaWQiOjF9.t6SrV_UvQ1Htjbu0wCSNHt9pEqSjOJaieB9hqHUSZ6k",
          access:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk2MzMxMjU0LCJpYXQiOjE2OTYzMzA5NTQsImp0aSI6IjY2Mzk4ZjNjZTdhNjQ0NzViMWFiMmVjMzQxMDU4MjFjIiwidXNlcl9pZCI6MX0._umPDSOSFhgdBDT5N2UVP4Aqv-RbeU_ovn0yzTjtsnE",
        },
      }),
  });

  const submitButton = screen.getByText("Login");
  fireEvent.click(submitButton);

  // Wait for success message to appear and assert its presence
  await waitFor(() => {
    const successPopup = screen.queryByText("Login Successfully!", {
      exact: false,
    });
    expect(successPopup).toBeInTheDocument();
  });
});

test("renders the Login component username and password validation", async () => {
  jest.setTimeout(15000); // Increased the timeout to 15 seconds

  render(<Login />);

  const emailInput = await screen.findByLabelText("Username");
  const passwordInput = await screen.findByLabelText("Password");

  fireEvent.change(emailInput, { target: { value: "admi" } });
  fireEvent.change(passwordInput, { target: { value: "Admi" } });

  const submitButton = screen.getByText("Login");
  fireEvent.click(submitButton);

  await waitFor(() => {
    const usernameValidation = screen.getByText(
      "Username must contain only small letters, numbers, and underscores and 5 to 20 characters long",
      { exact: false }
    );
    const passwordValidation = screen.getByText(
      "Password must be at least 8 characters long, uppercase and lowercase letters,one numeric character and special character",
      { exact: false }
    );
    expect(usernameValidation).toBeInTheDocument();
    expect(passwordValidation).toBeInTheDocument();
  });
});

test("renders the Login component username and password error message", async () => {
  jest.setTimeout(15000); // Increased the timeout to 15 seconds

  render(<Login />);

  const emailInput = await screen.findByLabelText("Username");
  const passwordInput = await screen.findByLabelText("Password");

  fireEvent.change(emailInput, { target: { value: "admin" } });
  fireEvent.change(passwordInput, { target: { value: "1234567" } });

  const submitButton = screen.getByText("Login");
  fireEvent.click(submitButton);

  await waitFor(() => {
    const errormessage = screen.getByText(
      "Password must be at least 8 characters long, uppercase and lowercase letters,one numeric character and special character",
      { exact: false }
    );
    expect(errormessage).toBeInTheDocument();
  });
});
