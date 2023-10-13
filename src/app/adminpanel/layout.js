import Header from "@/components/header";
import React from "react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {" "}
        <Header />
        {children}
      </body>
    </html>
  );
}
