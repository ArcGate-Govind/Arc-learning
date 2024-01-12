import Login from "@/components/Login";
import React from "react";

const page = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default page;
export function generateMetadata({ params }) {
  return {
    title: "Login",
  };
}
