import UserDetailsProvider from "@/context/createContext";
import "./globals.css";
import React from "react";
import Header from "@/components/header";

export const metadata = {
  titile: "Arc-Learing",
  description: "Create by Arcgate",
};

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
