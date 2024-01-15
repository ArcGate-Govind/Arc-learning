import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import VideoUploadForm from "@/components/videoUploadForm";

it("renders the UserProfile component", async () => {
  render(<VideoUploadForm />);
});

it("renders input label correctly", () => {
  render(<VideoUploadForm />);
  const titleLabel = screen.getByLabelText("Title:");
  expect(titleLabel).toBeInTheDocument();
});

it("renders input label correctly", () => {
  render(<VideoUploadForm />);
  const ProjectNameLable = screen.getByLabelText("Project Name:");
  expect(ProjectNameLable).toBeInTheDocument();
});
it("renders input label correctly", () => {
  render(<VideoUploadForm />);
  const DescriptionLable = screen.getByLabelText("Description:");
  expect(DescriptionLable).toBeInTheDocument();
});
it("renders input label correctly", () => {
  render(<VideoUploadForm />);
  const UsernameLable = screen.getByLabelText("Username:");
  expect(UsernameLable).toBeInTheDocument();
});
it("renders input label correctly", () => {
  render(<VideoUploadForm />);
  const ChooseavideoLable = screen.getByLabelText("Choose a video:");
  expect(ChooseavideoLable).toBeInTheDocument();
});
