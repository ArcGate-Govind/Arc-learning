"use client";
import Header from "@/components/header";
import React, { useState } from "react";
import UserDetailsProvider from "../../context/createContext";
import { SidebarContext } from "@/context/sidebarContext";

export default function RootLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <html>
      <body>
        <div className="w-fit md:w-auto">
          <UserDetailsProvider>
            <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
              <Header isOpen={isOpen} setIsOpen={setIsOpen} />
              {children}
            </SidebarContext.Provider>
          </UserDetailsProvider>
        </div>
      </body>
    </html>
  );
}
