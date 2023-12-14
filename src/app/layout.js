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
        <div className="w-fit md:w-auto">
          <UserDetailsProvider>
            {pathname != "/" ? <Header /> : ""}
            {dashboardPart[1] == "dashboard" ? <Dashboard /> : ""}
            {children}
          </UserDetailsProvider>
        </div>
      </body>
    </html>
  );
}
