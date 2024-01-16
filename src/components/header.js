"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/image/arcgate-logo.png";
import LogoutImage from "@/image/logout.png";
import Backbutton from "@/image/backbutton.png";
import { usePathname } from "next/navigation";
import {
  getToken,
  getUser,
  getAccessToken,
  removeUserSession,
} from "@/utils/common";
import { useRouter } from "next/navigation";
import { API_URL } from "../../constant";

// Header component
const Header = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const userName = getUser();
  const accessToken = getAccessToken();
  const refresh = getToken();

  // Effect to set isClient state to true after component mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Logout handler function
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh }),
      });

      // If logout is successful, remove user session and navigate to the homepage
      if (response.status == 200) {
        removeUserSession();
        localStorage.removeItem("currentPage");
        localStorage.removeItem("values");
        localStorage.removeItem("currentPageVideo");
        localStorage.removeItem("videoSearchValues");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Navigate back function
  const goBack = () => {
    router.back();
  };

  // Get the current pathname using Next.js usePathname hook
  const pathname = usePathname();

  // Check if the current page is an admin panel, OTP, or QR verification page
  const isOnAdminPanel = pathname === "/adminpanel";
  const isOTP = pathname === "/twofaverify";
  const isQR = pathname === "/twofaregister";

  // Render the header only if the pathname is not the homepage ("/")
  if (pathname !== "/") {
    return (
      <>
        {/* Header layout */}
        <div className="header bg-[#1D2E3E] p-4 flex items-center justify-between">
          {/* Render back button if not on admin panel, OTP, or QR page */}
          {!isOnAdminPanel && !isOTP && !isQR && (
            <Image
              className="cursor-pointer"
              alt="Arcgate"
              onClick={goBack}
              width={30}
              src={Backbutton}
            />
          )}

          {/* Arcgate logo with navigation to admin panel */}
          <div className="logo w-36 md:w-32 text-center md:text-left md:m-auto">
            <Image
              src={Logo}
              className="cursor-pointer"
              alt="Arcgate"
              onClick={() => {
                router.push("/adminpanel", { scroll: false });
              }}
            />
          </div>

          {/* User information and logout button */}
          <div className="flex gap-x-2 md:gap-x-4 items-center md:items-start mt-2 md:mt-0">
            <p className="text-[#ffff] uppercase text-lg md:text-xl">
              {isClient ? userName : "username"}
            </p>
            <Image
              onClick={handleLogout}
              src={LogoutImage}
              alt="LogoutImage"
              className="w-5 md:w-8 cursor-pointer"
            />
          </div>
        </div>
      </>
    );
  }
};

export default Header;
