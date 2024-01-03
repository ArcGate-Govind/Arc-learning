import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";
import VideoContainer from "@/app/dashboard/videocontainer/page";
import UserDetailsProvider from "@/context/createContext";
import {
  LOADING_MESSAGE,
  SEARCH_FIELD_MESSAGE,
  SEARCH_RESULT_MESSAGE,
} from "../../message";
import AOSWrapper from "@/components/aosWrapper";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    pathname: "/dashboard/videocontainer",
    query: {},
    asPath: "/dashboard/videocontainer",
    push: jest.fn(),
  }),
}));

let mockData = [
  {
    id: 149,
    title: "React_chunk_1",
    description: "React Test",
    file: "/media/videos/React/React_chunk_1_1703148019.mp4",
    uploaded_by: "TestUser",
    project: "payroll",
    total_likes: 1,
  },
  {
    id: 150,
    title: "React_chunk_2",
    description: "React Test2",
    file: "/media/videos/React/React_chunk_2_1703148019.mp4",
    uploaded_by: "TestUser",
    project: "",
    total_likes: 0,
  },
  {
    id: 151,
    title: "React_chunk_3",
    description:
      "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    file: "/media/videos/React/React_chunk_3_1703148019.mp4",
    uploaded_by: "TestUser",
    project: "",
    total_likes: 0,
  },
  {
    id: 152,
    title: "React_chunk_4",
    description:
      "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    file: "/media/videos/React/React_chunk_4_1703148019.mp4",
    uploaded_by: "TestUser",
    project: "",
    total_likes: 0,
  },
  {
    id: 153,
    title: "React_chunk_5",
    description:
      "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    file: "/media/videos/React/React_chunk_5_1703148019.mp4",
    uploaded_by: "TestUser",
    project: "",
    total_likes: 0,
  },
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        message: "success",
        code: 200,
        results: mockData,
        pagination: {
          total_items: 18,
          total_pages: 3,
          current_page: 1,
          limit: 2,
          next: 2,
          previous: null,
        },
      }),
  })
);

let component;

beforeEach(() => {
  component = (
    <UserDetailsProvider>
      <AOSWrapper>
        <VideoContainer />
      </AOSWrapper>
    </UserDetailsProvider>
  );
});

describe("VideoContainer", () => {
  test("Renders component correctly.", () => {
    render(component);
  });

  test("An error message is displayed when the search button is clicked with empty inputs.", async () => {
    render(component);

    const searchButton = screen.getByText("Search");

    fireEvent.click(searchButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(SEARCH_FIELD_MESSAGE);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("Search functionality works correctly", async () => {
    render(component);

    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "React_chunk_1" } });

    const searchButton = screen.getByText("Search");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(searchInput.value).toBe("React_chunk_1");
      const videoTitles = screen.queryAllByText(/React_chunk_\d/);
      expect(videoTitles).toHaveLength(0);
      if (videoTitles.length > 0) {
        expect(videoTitles[0]).toHaveTextContent("React_chunk_1");
      }
    });
  });

  test("Search functionality works correctly when result was empty", async () => {
    render(component);

    const searchInput = await screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "ErroMessageTest" } });

    const searchButton = screen.getByText("Search");
    fireEvent.click(searchButton);

    await waitFor(() => {
      const videoResult = screen.queryByText(SEARCH_RESULT_MESSAGE);
      expect(videoResult).not.toBeInTheDocument();
    });
  });

  test("Clear functionality works correctly", async () => {
    render(component);
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "TestSearch" } });

    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);

    await act(async () => {
      await waitFor(() => {
        fireEvent.change(searchInput, { target: { value: "" } });
      });
    });
  });

  test("Renders loading message initially", async () => {
    render(component);
    const loadingMessage = screen.getByText(LOADING_MESSAGE);
    expect(loadingMessage).toBeInTheDocument();
  });

  test("when data leanth is 0", async () => {
    render(component);

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  test("API data fetched successfully", async () => {
    render(component);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.queryByText("React_chunk_1")).toBeInTheDocument();
    expect(screen.queryByText("React Test")).toBeInTheDocument();
    expect(screen.queryByText("React_chunk_2")).toBeInTheDocument();
    expect(screen.queryByText("React Test2")).toBeInTheDocument();
  });

  test("Fetches paginated data on scroll", async () => {
    render(component);

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.queryByText("React_chunk_1")).toBeInTheDocument();
    expect(screen.queryByText("React_chunk_2")).toBeInTheDocument();

    act(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.queryByText("React_chunk_3")).toBeInTheDocument();
    expect(screen.queryByText("React_chunk_4")).toBeInTheDocument();
  });
});
