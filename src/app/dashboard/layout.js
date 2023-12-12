import Header from "@/components/header";
import React from "react";
import Dashboard from "@/components/dashboard";
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <div className="w-fit md:w-auto">
          <Header />
          <Dashboard />
          {children}
        </div>
      </body>
    </html>
  );
}
