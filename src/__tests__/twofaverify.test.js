import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { act } from "react-dom/test-utils";
import Page from "./Page"; 

const server = setupServer(
  rest.post(`${API_URL}otp-verification/`, (req, res, ctx) => {
    const { otp } = req.body;
    if (otp === "123456") {
      return res(
        ctx.status(200),
        ctx.json({
          message: "OTP verification successful",
        })
      );
    } else {
      return res(
        ctx.status(400),
        ctx.json({
          message: "Invalid OTP",
        })
      );
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders the OTP input and submit button", () => {
  render(<Page />);

  expect(screen.getByPlaceholderText("Enter OTP")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
});

test("shows validation error for empty OTP field", async () => {
  render(<Page />);

  userEvent.click(screen.getByRole("button", { name: "Submit" }));

  await waitFor(() => {
    expect(screen.getByText("OTP is required")).toBeInTheDocument();
  });
});

test("submits the form with valid OTP and redirects to '/adminpanel'", async () => {
  render(<Page />);

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter OTP"), {
      target: { value: "123456" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Submit" }));
  });

  await waitFor(() => {
    expect(screen.queryByText("OTP verification successful")).toBeInTheDocument();
    expect(screen.queryByText("Invalid OTP")).not.toBeInTheDocument();
  });

 
  expect(window.location.pathname).toBe("/adminpanel");
});

test("shows error message for invalid OTP", async () => {
  render(<Page />);

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter OTP"), {
      target: { value: "invalidOTP" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Submit" }));
  });

  await waitFor(() => {
    expect(screen.getByText("Invalid OTP")).toBeInTheDocument();
    expect(screen.queryByText("OTP verification successful")).not.toBeInTheDocument();
  });
});
