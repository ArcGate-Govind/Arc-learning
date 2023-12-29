import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
// import { act } from "react-dom/test-utils";
import Comment from "../components/comment";

describe("Comment", () => {
  it("renders Comment component and handles comment input", () => {
    render(<Comment onClose={() => {}} />);

    const commentInput = screen.getByPlaceholderText("Add a comment...");
    expect(commentInput).toBeInTheDocument();

    fireEvent.change(commentInput, { target: { value: "Test comment" } });

    expect(commentInput.value).toBe("Test comment");

    const commentButton = screen.getByText("Comment");
    expect(commentButton).toHaveClass("cursor-pointer");

    expect(commentButton).not.toHaveClass("cursor-not-allowed");

    fireEvent.click(commentButton);

    expect(commentInput.value).toBe("");
  });

  it("renders Comment component and handles cancel button", () => {
    const onCloseMock = jest.fn();
    render(<Comment onClose={onCloseMock} />);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
