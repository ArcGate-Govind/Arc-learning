import React from "react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {" "}
        <h1>headr page for all adminpanel </h1>
        {children}
      </body>
    </html>
  );
}
