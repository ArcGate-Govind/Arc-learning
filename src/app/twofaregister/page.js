"use client";
import React, { useState, useEffect } from "react";
import { getaccessToken } from "@/utils/common";
import QRCode from "qrcode.react";
import { useRouter } from "next/navigation";

let accessToken = getaccessToken();

const page = () => {
  const router = useRouter();
  const [otpUrl, setOtpUrl] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/otp-verification/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response?.json();
        setOtpUrl(data.otp_url);
        console.log(data, "data");
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, []);

  return (
    <>
    <h1 className="text-center mt-5">Please Scan</h1>
    <div className="flex justify-center mt-10 mb-10">
      
      <QRCode size="200" value={otpUrl} />
    </div>
   <div className="flex justify-center">
   <button className="bg-[#E3F2FD] px-10 py-2"
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
