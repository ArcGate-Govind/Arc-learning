"use client";
import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { removeUserSession, setUserSession } from "../utils/common";
import { API_URL } from "../../constant";
import {
  ERROR_MESSAGE,
  LOGIN_FAILED_MESSAGE,
  PASSWORD_ERROR_MESSAGE,
  USERNAME_ERROR_MESSAGE,
} from "../../message";

const ErrorMessage = (props) => {
  return (
    <div className=" m-auto">
      <p className="text-red-600 text-sm mt-2">{props.message}</p>
    </div>
  );
};

const Login = () => {
  const router = useRouter();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showMessage, setShowMessage] = useState("");

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

    onSubmit: async (values) => {
      let email = values.email;
      let password = values.password;
      await fetch(`${API_URL}login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const token = data.token;
          if (data.token) {
            setUserSession(token.refresh, token.access, data.token.username);
            handleOpenPopup("/adminpanel");
          } else {
            handleShowErroMessage(data.non_field_errors[0], "/");
          }
        })
        .catch((error) => {
          removeUserSession();
          localStorage.removeItem("currentPage");
          localStorage.removeItem("values");
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

  const handleOpenPopup = (path) => {
    router.push(path);
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen">
      <div className="login_back-ground absolute inset-0"></div>
      <div className="bg-white  sm:w-1/2 md:w-1/3 lg:w-1/3 p-6 md:p-12 rounded-lg shadow-lg relative z-1">
        {showErrorMessage && <ErrorMessage message={showMessage} />}
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
