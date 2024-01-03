import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalBox from "../components/modalBox";

describe("ModalBox", () => {
  test("renders ModalBox with children and closes on button click", () => {
    const onCloseMock = jest.fn();

    render(
      <ModalBox onClose={onCloseMock}>
        <div>Modal Content</div>
      </ModalBox>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();

    fireEvent.click(screen.getByText("X"));

    expect(onCloseMock).toHaveBeenCalled();
  });
});
