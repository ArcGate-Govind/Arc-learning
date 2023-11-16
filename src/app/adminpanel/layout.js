import Header from "@/components/header";
import React from "react";
import UserDetailsProvider from "../../context/createContext";
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <React.Fragment className="w-fit md:w-auto">
          <UserDetailsProvider>
            <Header />
            {children}
          </UserDetailsProvider>
        </React.Fragment>
      </body>
    </html>
  );
}
