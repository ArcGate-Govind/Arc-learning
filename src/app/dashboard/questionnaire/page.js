import Questionnaire from "@/components/Questionnaire";
import React from "react";

const page = () => {
  return (
    <>
      <Questionnaire />
    </>
  );
};

export default page;
export function generateMetadata({ params }) {
  return {
    title: "Questionnaire",
  };
}
