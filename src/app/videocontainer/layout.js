import Header from "@/components/header";
import VideoProjectCreateContext from "@/context/videoProjectCreateContext";
import React from "react";
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <div>
          <VideoProjectCreateContext>
            <Header />
            {children}
          </VideoProjectCreateContext>
        </div>
      </body>
    </html>
  );
}
