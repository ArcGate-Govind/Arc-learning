"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import PopupMessage from "@/components/popupMessage";
import { getAccessToken } from "@/utils/common";
import { API_URL } from "../../constant";

const accessToken = getAccessToken();

const TwoFaverify = () => {
  const router = useRouter();

  // State variables for loading state and popup message
  const [loading, setLoading] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupMessage, setPopupMessage] = React.useState("");

  // Formik hook for handling form state and validation
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string().required("OTP is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // Send OTP verification request to the server
        const response = await fetch(`${API_URL}otp-verification/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            otp: values.otp,
            faStatus: true,
          }),
        });

        const data = await response.json();

        // Check if the response is OK
        if (response.ok) {
          setPopupMessage(data?.message);
          router.push("/adminpanel");
        } else {
          setPopupMessage(data?.message);
        }

        // Show the popup message
        setShowPopup(true);

        // Hide the popup message after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
  });

  // Render the UI for the TwoFaverify component
  return (
    <>
      {/* Display a heading for OTP entry */}
      <div className="flex justify-center mt-5">
        <h1 className="text-lg italic font-bold">Please Enter The OTP </h1>
      </div>

      {/* Form for OTP entry */}
      <form onSubmit={formik.handleSubmit}>
        <div className="flex justify-center mt-4">
          <input
            className={`py-2 px-3 bg-[#FFFFFF] cursor-pointer shadow-md outline-none border-solid border-2 border-black ${
              formik.touched.otp && formik.errors.otp ? "border-red-500" : ""
            }`}
            type="text"
            placeholder="Enter OTP"
            {...formik.getFieldProps("otp")}
          />
        </div>

        {/* Display error message for OTP validation */}
        {formik.touched.otp && formik.errors.otp && (
          <div className="text-red-500 flex justify-center item-center">
            {formik.errors.otp}
          </div>
        )}

        {/* Button for OTP submission */}
        <div className="flex justify-center mt-10">
          <button
            className="bg-[#466EA1] text-white py-2 px-4 rounded-md cursor-pointer hover:bg-gray-200 hover:text-[#466EA1] "
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Display popup message component when showPopup is true */}
      {showPopup && <PopupMessage showPopupMessage={popupMessage} />}
    </>
  );
};

export default TwoFaverify;
