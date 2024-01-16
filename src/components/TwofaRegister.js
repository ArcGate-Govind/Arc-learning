"use client";
import React, { useState, useEffect } from "react";
import { getAccessToken } from "@/utils/common";
import QRCode from "qrcode.react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../constant";

let accessToken = getAccessToken();

const TwofaRegister = () => {
  const router = useRouter();

  // State to store the OTP (One-Time Password) URL
  const [otpUrl, setOtpUrl] = useState("");

  // Fetch OTP URL from the server on component mount
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}otp-verification/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response?.json();

        // Set the OTP URL in the component state
        setOtpUrl(data.otp_url);
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, []);
  // Render the UI for the TwofaRegister component
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
            // Navigate to the TwofaVerify page on button click
            router.push("/twofaverify");
          }}
        >
          Done
        </button>
      </div>
    </>
  );
};

export default TwofaRegister;
