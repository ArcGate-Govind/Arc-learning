import Header from "@/components/header";
import React from "react";
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <div>
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
