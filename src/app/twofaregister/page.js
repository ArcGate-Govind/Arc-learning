"use client";
import React, { useState, useEffect } from "react";
import { getAccessToken } from "@/utils/common";
import QRCode from "qrcode.react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../../constant";

let accessToken = getAccessToken();

const page = ({data}) => {
  const router = useRouter();
  const [otpUrl, setOtpUrl] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${API_URL}otp-verification/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response?.json();
        setOtpUrl(data.otp_url);
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, []);

  return (
    <>
    {/* <h1 className="text-center mt-5">Please Scan</h1> */}
    <div className="flex items-center justify-center mt-8">
        <div className="bg-white p-10 rounded-lg shadow-xl">
        <QRCode  size="200" value={otpUrl} />
        </div>
      </div>
   <div className="flex justify-center mt-8">
   <button className="bg-[#466EA1] text-white py-2 px-4 rounded-md cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
        onClick={() => {
          router.push("/twofaverify");
        }}
      >
        Done
      </button>
   </div>
    </>
  );
};

export default page;