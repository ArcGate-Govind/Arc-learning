import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import VideoPopup from "@/components/videoPopup";
import { act } from "react-dom/test-utils";
import { getAccessToken } from "@/utils/common";
import { API_URL } from "../../constant";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ status: 200 }),
  })
);

describe("VideoPopup", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders VideoPopup with loading state and handles video interactions", async () => {
    const mockOnClose = jest.fn();
    const mockData = {
      id: 1,
      title: "React_chunk_1",
      description:
        "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      file: "/media/videos/React/React_chunk_1_1703148019.mp4",
      uploaded_by: "TestUser",
      project: "",
      total_likes: 1,
    };

    render(<VideoPopup onClose={mockOnClose} data={mockData} />);

    await act(async () => {
      expect(screen.getByText("X")).toBeInTheDocument();
    });

    expect(screen.getByText("1")).toBeInTheDocument();

    expect(
      screen.getByText(
        /Dummy text of the printing and typesetting industry\. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book\./i
      )
    ).toBeInTheDocument();
  });

  test("renders VideoPopup with loading state and handles video interactions", async () => {
    const mockOnClose = jest.fn();
    const mockData = {
      id: 2,
      title: "React_chunk_2",
      description: "Dummy test case.",
      file: "/media/videos/React/React_chunk_1_1703148019.mp4",
      uploaded_by: "TestUser",
      project: "",
      total_likes: 2,
    };

    render(<VideoPopup onClose={mockOnClose} data={mockData} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("X")).toBeInTheDocument();

    expect(screen.getByText("2")).toBeInTheDocument();

    expect(
      screen.getByText(/2\s*____\s*Dummy test case\./)
    ).toBeInTheDocument();
  });

  test("renders VideoPopup with loading state and handles video interactions", async () => {
    const data = {
      id: 1,
      total_likes: 10,
      is_liked: false,
    };

    const { getByText } = render(<VideoPopup data={data} />);

    const element = screen.getByTestId("like-button");

    act(() => {
      fireEvent.click(element);
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}dashboard/likes/${data.id}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );

    expect(getByText("10")).toBeInTheDocument();
  });
});
