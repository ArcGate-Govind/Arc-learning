import Header from "@/components/header";
import React from "react";
import UserDetailsProvider from "../../context/createContext";
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <div className="w-fit md:w-auto">
          <UserDetailsProvider>
            <Header />
            {children}
          </UserDetailsProvider>
        </div>
      </body>
    </html>
  );
}
