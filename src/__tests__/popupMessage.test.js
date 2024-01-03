import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PopupMessage from "../components/popupMessage";

describe("PopupMessage", () => {
  test("renders PopupMessage with the provided message", () => {
    const message = "This is a test message";

    render(<PopupMessage showPopupMessage={message} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
