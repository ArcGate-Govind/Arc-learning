"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../image/arcgate-logo.png";
import LogoutImage from "../image/logout.png";
import {
  getToken,
  getUser,
  getaccessToken,
  removeUserSession,
} from "@/utils/common";
import { useRouter } from "next/navigation";
import { API_URL } from "../../globals";

const Header = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const userName = getUser();
  const accessToken = getaccessToken();
  const refresh = getToken();

  useEffect(() => {
    setIsClient(true);
  }, []);

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

      const json = await response.json();
      console.log("json", json);
      if (response.status == 200) {
        removeUserSession();
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="header bg-[#1D2E3E] p-4 flex items-center justify-between">
        <div className="logo w-36 md:w-32 text-center md:text-left md:m-auto">
          <Image src={Logo} alt="Arcgate" />
        </div>
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
};

export default Header;
