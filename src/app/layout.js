"use client";
import UserDetailsProvider from "@/context/createContext";
import "./globals.css";
import React from "react";
import Header from "@/components/header";
import { usePathname } from "next/navigation";
import Dashboard from "@/components/dashboard";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const dashboardPart = pathname.split("/");
  return (
    <html>
      <body>
        {pathname != "/" ? (
          <div className="w-fit md:w-auto">
            <UserDetailsProvider>
              <Header />
              {children}
            </UserDetailsProvider>
          </div>
        ) : (
          <div>{children}</div>
        )}
      </body>
    </html>
  );
}
