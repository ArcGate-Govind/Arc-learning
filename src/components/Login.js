"use client";
import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { setSecretSession, setURLSession } from "../utils/common";
import { API_URL } from "../../constant";
import {
  ERROR_MESSAGE,
  LOGIN_FAILED_MESSAGE,
  PASSWORD_ERROR_MESSAGE,
  USERNAME_ERROR_MESSAGE,
} from "../../message";
import axios from "axios";

// ErrorMessage component to display error messages
const ErrorMessage = (props) => {
  return (
    <div className=" m-auto">
      <p className="text-red-600 text-sm mt-2">{props.message}</p>
    </div>
  );
};

// Login component
const Login = () => {
  const router = useRouter();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showMessage, setShowMessage] = useState("");

  // Form validation using Yup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/,
          USERNAME_ERROR_MESSAGE
        )
        .email(USERNAME_ERROR_MESSAGE)
        .max(30, USERNAME_ERROR_MESSAGE)
        .required(ERROR_MESSAGE),
      password: Yup.string()
        .oneOf([Yup.ref("password"), null])
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
          PASSWORD_ERROR_MESSAGE
        )
        .min(8, PASSWORD_ERROR_MESSAGE)
        .required(ERROR_MESSAGE),
    }),

    // Handle form submission
    onSubmit: async (values) => {
      let email = values.email;
      let password = values.password;

      try {
        const response = await axios.post(
          `${API_URL}login/`,
          {
            email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        const token = data.token;
        // If login is successful, set user session and navigate to the appropriate page
        if (data.code == 200) {
          if (data?.otp_url) {
            setURLSession(data.otp_url);
            setSecretSession(data.secret_key);
            handleOpenPopup("/twofaregister");
          } else {
            setSecretSession(data.secret_key);
            handleOpenPopup("/twofaverify");
          }
        } else {
          // If login fails, show error message and navigate to the login page
          handleShowErrorMessage(data.non_field_errors[0], "/");
        }
      } catch (error) {
        handleShowErrorMessage(LOGIN_FAILED_MESSAGE, "/");
      }
    },
  });

  // Function to show error message and navigate to a specified path
  const handleShowErrorMessage = (message, path) => {
    setShowMessage(message);
    setShowErrorMessage(true);
    router.push(path);
  };

  // Function to navigate to a specified path
  const handleOpenPopup = (path) => {
    router.push(path);
  };

  // Render the component
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen">
      <div className="login_back-ground absolute inset-0"></div>
      <div className="bg-white  sm:w-1/2 md:w-1/3 lg:w-1/3 p-6 md:p-12 rounded-lg shadow-lg relative z-1">
        {showErrorMessage && <ErrorMessage message={showMessage} />}
        {/* Login Form */}
        <form className="form-content" onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              className=" border border-gray-300 p-1 mt-4 block w-full cursor-pointer rounded-md"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-2">{formik.errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              className="border border-gray-300 p-1 mt-4 block w-full cursor-pointer rounded-md"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {formik.errors.password}
              </p>
            )}
          </div>
          <div className="mb-4 flex justify-end">
            <button
              type="submit"
              className="bg-[#466EA1] text-white py-2 px-4 rounded button"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
