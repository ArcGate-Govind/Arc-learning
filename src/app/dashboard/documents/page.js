import Documents from "@/components/Documents";
import React from "react";

const page = () => {
  return (
    <>
      <Documents />
    </>
  );
};

export default page;

export function generateMetadata({ params }) {
  return {
    title: "PDF Documents",
  };
}
