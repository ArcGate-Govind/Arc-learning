import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import VideoProjectCreateContext from "@/context/videoProjectCreateContext";
import VideoContainer from "@/app/videocontainer/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    pathname: "/videocontainer",
    query: {},
    asPath: "/videocontainer",
    push: jest.fn(),
  }),
}));

let component;

beforeAll(() => {
  component = (
    <VideoProjectCreateContext>
      <VideoContainer />
    </VideoProjectCreateContext>
  );
});

describe("AdminPanel", () => {
  test("Renders component correctly.", () => {
    render(component);
  });
});
