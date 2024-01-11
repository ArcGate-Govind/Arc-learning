import AdminPanel from "@/components/AdminPanel";
import React from "react";

const page = () => {
  return (
    <>
      <AdminPanel />
    </>
  );
};

export default page;

export function generateMetadata({ params }) {
  return {
    title: "Admin Panel",
  };
}
