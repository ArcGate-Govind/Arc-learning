import Header from "@/components/header";
import React from "react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="w-fit md:w-auto">
        {" "}
        <Header />
        {children}
      </body> 
    </html>
  );
}
