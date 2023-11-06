import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import Login from "../../src/app/page";
import { LOGIN_FAILED_MESSAGE, PASSWORD_ERROR_MESSAGE } from "../../message";

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

global.fetch = jest.fn().mockRejectedValue({});

test("renders the Login component with login error", async () => {
  jest.setTimeout(15000); // Increased the timeout to 15 seconds

  render(<Login />);

  const emailInput = await screen.getByLabelText("Email");
  const passwordInput = await screen.getByLabelText("Password");

  fireEvent.change(emailInput, { target: { value: "admin@gmail.com" } });
  fireEvent.change(passwordInput, { target: { value: "Admin@12" } });

  const submitButton = screen.getByText("Login");

  fireEvent.click(submitButton);

  // Wait for the error message to appear
  await screen.findByText(LOGIN_FAILED_MESSAGE, { exact: false });
});

test("renders the Login component Successfully", () => {
  jest.setTimeout(15000);
  act(async () => {
    render(<Login />);

    const emailInput = await screen.findByLabelText("Email");
    const passwordInput = await screen.findByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "admin@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "Admin@12" } });

    // Mock successful API response
    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          token: {
            message: "Login Successfully!",
            email: "admin",
            refresh:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5NjQxNzM1NCwiaWF0IjoxNjk2MzMwOTU0LCJqdGkiOiIwMTYwYzgzYWQyMjk0MDNhODNjYjBhM2RlNDEzOTc4MCIsInVzZXJfaWQiOjF9.t6SrV_UvQ1Htjbu0wCSNHt9pEqSjOJaieB9hqHUSZ6k",
            access:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk2MzMxMjU0LCJpYXQiOjE2OTYzMzA5NTQsImp0aSI6IjY2Mzk4ZjNjZTdhNjQ0NzViMWFiMmVjMzQxMDU4MjFjIiwidXNlcl9pZCI6MX0._umPDSOSFhgdBDT5N2UVP4Aqv-RbeU_ovn0yzTjtsnE",
          },
        }),
    });

    const submitButton = screen.getByText("Login");
    fireEvent.click(submitButton);
  });
});

test("renders the Login component email and password validation", () => {
  jest.setTimeout(15000); // Increased the timeout to 15 seconds
  act(async () => {
    render(<Login />);

    const emailInput = await screen.findByLabelText("Email");
    const passwordInput = await screen.findByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "admi@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "Admi" } });

    const submitButton = screen.getByText("Login");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordValidation = screen.getByText(PASSWORD_ERROR_MESSAGE, {
        exact: false,
      });
      expect(passwordValidation).toBeInTheDocument();
    });
  });
});

test("renders the Login component email and password error message", () => {
  jest.setTimeout(15000);
  act(async () => {
    render(<Login />);

    const emailInput = await screen.findByLabelText("Email");
    const passwordInput = await screen.findByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "admin@13" } });
    fireEvent.change(passwordInput, { target: { value: "12345678" } });

    const submitButton = screen.getByText("Login");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errormessage = screen.getByText(PASSWORD_ERROR_MESSAGE, {
        exact: false,
      });
      expect(errormessage).toBeInTheDocument();
    });
  });
});

test("renders the Login component invalid credentials", () => {
  jest.setTimeout(2000);

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          non_field_errors: ["Invalid credentials"],
        }),
    })
  );
  act(async () => {
    render(<Login />);

    const emailInput = await screen.findByLabelText("Email");
    const passwordInput = await screen.findByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "admiii@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "Admin@18" } });

    const submitButton = screen.getByText("Login");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText("Invalid credentials");
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
