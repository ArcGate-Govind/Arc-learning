import TwofaRegister from "@/components/TwofaRegister";
import React from "react";

const page = () => {
  return (
    <>
      <TwofaRegister />
    </>
  );
};

export default page;

export function generateMetadata({ params }) {
  return {
    title: "GA Register",
  };
}
