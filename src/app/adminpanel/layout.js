import React from "react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {" "}
        <h1>Header page for all admin panel </h1>
        {children}
      </body>
    </html>
  );
}
