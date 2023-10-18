"use client";
import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { removeUserSession, setUserSession } from "../utils/common";
import {
  API_URL,
  ERROR_MESSAGE,
  LOGIN_FAILED_MESSAGE,
  PASSWORD_ERROR_MESSAGE,
  USERNAME_ERROR_MESSAGE,
} from "../../globals";

const ErrorMessage = (props) => {
  return (
    <div className=" m-auto">
      <p className="text-red-600 text-sm mt-2">{props.message}</p>
    </div>
  );
};

const Popup = (props) => {
  return (
    <div className="inset-0 z-50 fixed bg-black bg-opacity-30 backdrop-blur-md flex items-center justify-center modal__wrapper pointer-events-auto ">
      <div className="bg-white w-1/3 max-w-2xl p-4 rounded-lg modal__container transform translate-y-0 transition-transform">
        <p className="text-xl mb-6">{props.message}</p>
      </div>
    </div>
  );
};

const Login = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showMessage, setShowMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
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

    onSubmit: async (values) => {
      let username = values.username;
      let password = values.password;
      await fetch(`${API_URL}login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const token = data.token;
          if (data.token) {
            setUserSession(token.refresh, token.access, data.token.username);
            handleOpenPopup(token.message, "/adminpanel");
          } else {
            handleShowErroMessage(data.non_field_errors[0], "/");
          }
        })
        .catch((error) => {
          removeUserSession();
          handleShowErroMessage(LOGIN_FAILED_MESSAGE, "/");
          // console.error("Login error:", error);
        });
    },
  });

  const handleShowErroMessage = (message, path) => {
    setShowMessage(message);
    setShowErrorMessage(true);
    router.push(path);
  };

  const handleOpenPopup = (message, path) => {
    setShowMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      router.push(path);
    }, 1000);
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen">
      <div className="login_back-ground absolute inset-0"></div>
      <div className="bg-white  sm:w-1/2 md:w-1/3 lg:w-1/3 p-6 md:p-12 rounded-lg shadow-lg relative z-1">
        {!showPopup && showErrorMessage && <ErrorMessage message={showMessage} />}
        <form className="form-content" onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              onChange={formik.handleChange}
              value={formik.values.username}
              onBlur={formik.handleBlur}
              className=" border border-gray-300 p-1 mt-4 block w-full cursor-pointer rounded-md"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-sm mt-2">
                {formik.errors.username}
              </p>
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
      {!showErrorMessage && showPopup && <Popup message={showMessage} />}
    </section>
  );
};

export default Login;
