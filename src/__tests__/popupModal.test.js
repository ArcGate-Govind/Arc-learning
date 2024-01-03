import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PopupModal from "../components/popupModal";
import { UNSAVED_ALERT_MESSAGE } from "../../message";

describe("PopupModal", () => {
  test("renders PopupModal with the correct content and handles button clicks", () => {
    const mockCloseModal = jest.fn();
    const mockConfirmModal = jest.fn();

    render(
      <PopupModal closeModal={mockCloseModal} confirmModal={mockConfirmModal} />
    );

    expect(screen.getByText(UNSAVED_ALERT_MESSAGE)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseModal).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Confirm"));
    expect(mockConfirmModal).toHaveBeenCalledTimes(1);
  });
});
