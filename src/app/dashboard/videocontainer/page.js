import VideoContainer from "@/components/Videocontainer";
import React from "react";

const page = () => {
  return (
    <>
      <VideoContainer />
    </>
  );
};

export default page;
export function generateMetadata({ params }) {
  return {
    title: "Video Page",
  };
}
