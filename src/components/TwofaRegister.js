"use client";
import React, { useState, useEffect } from "react";
import { getURL, removeURLSession } from "@/utils/common";
import QRCode from "qrcode.react";
import { useRouter } from "next/navigation";

const TwofaRegister = () => {
  const router = useRouter();

  // State to store the OTP (One-Time Password) URL
  const [otpUrl, setOtpUrl] = useState("");

  // Fetch OTP URL from the server on component mount
  useEffect(() => {
    let otpVerifyUrl = getURL();
    setOtpUrl(otpVerifyUrl);
  }, []);
  // Render the UI for the TwofaRegister component

  const handleNextPage = (path) => {
    router.push(path);
    removeURLSession();
  };
  return (
    <>
      {/* Display the OTP QR Code in a centered container */}
      <div className="flex items-center justify-center mt-8">
        <div className="bg-white p-10 rounded-lg shadow-xl">
          <QRCode size="200" value={otpUrl} />
        </div>
      </div>

      {/* Display a button to navigate to the TwofaVerify page */}
      <div className="flex justify-center mt-8">
        <button
          className="bg-[#466EA1] text-white py-2 px-4 rounded-md cursor-pointer hover:bg-gray-200 hover:text-[#466EA1]"
          onClick={() => {
            handleNextPage("/twofaverify");
          }}
        >
          Done
        </button>
      </div>
    </>
  );
};

export default TwofaRegister;
