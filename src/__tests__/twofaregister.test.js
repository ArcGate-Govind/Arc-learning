import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import Page from "./page"; 


const server = setupServer(
  rest.get(`${API_URL}otp-verification/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        otp_url: "otpauth://totp/admin?secret=RGBWP5HF36LF23Q5G5USKI55JMEMK7LT",
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders QR code with correct URL", async () => {
  render(<Page />);


  await waitFor(() => {
    expect(screen.getByRole("img", { name: "QR Code" })).toBeInTheDocument();
  });

  const qrCodeImg = screen.getByRole("img", { name: "QR Code" });
  expect(qrCodeImg).toHaveAttribute("src", "tpauth://totp/admin?secret=RGBWP5HF36LF23Q5G5USKI55JMEMK7LT");
});

test("navigates to '/twofaverify' on 'Done' button click", async () => {
  render(<Page />);


  await waitFor(() => {
    expect(screen.getByRole("img", { name: "QR Code" })).toBeInTheDocument();
  });

  userEvent.click(screen.getByText("Done"));

  expect(window.location.pathname).toBe("/twofaverify");
});


