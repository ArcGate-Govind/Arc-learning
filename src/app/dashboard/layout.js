import Header from "@/components/header";
import React from "react";
import Dashboard from "@/components/dashboard";
import VideoProjectCreateContext from "@/context/videoProjectCreateContext";
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <div className="w-fit md:w-auto">
        <VideoProjectCreateContext>
          <Header />
          <Dashboard />
          {children}
          </VideoProjectCreateContext>
        </div>
      </body>
    </html>
  );
}
