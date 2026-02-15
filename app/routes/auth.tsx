/**
 * Login Page
 * Handles user login via form and redirects authenticated users to home.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { handleLogin } from "~/auth/auth";
import { useLoginStore } from "../zustand/loginStore";
import Cookies from "js-cookie";
import { base64Decode } from "../utils/scripting";
import { Spinner, Button100 } from "../components";
import { AUTH_COOKIE } from "~/utils/constants";

/* ----------------------------- Types ---------------------------------- */

type FormInputs = {
  username: string;
  password: string;
};

type FormProps = {
  method: string;
  className: string;
  children: React.ReactNode;
  loginInputs: FormInputs;
};

/* ----------------------------- Form Component ------------------------- */

/**
 * Controlled form component for login submission
 */
function Form({ method, className, children, loginInputs }: FormProps) {
  const setLoginInfo = useLoginStore((state) => state.setLoginInfo);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleLogin(loginInputs, setLoginInfo);
  };

  return (
    <form method={method} className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}

/* ----------------------------- LoginPage ------------------------------ */

export default function LoginPage() {
  /* ----------------------------- State -------------------------------- */

  const [formInputs, setFormInputs] = useState<FormInputs>({
    username: "",
    password: "",
  });

  const loginInfo = useLoginStore((state) => state.loginInfo);
  const setLoginInfo = useLoginStore((state) => state.setLoginInfo);

  const navigate = useNavigate();

  /* -------------------------- Effects --------------------------------- */

  /**
   * Check for existing auth cookie on mount
   * If valid, update login store and redirect to home
   */
  useEffect(() => {
    const cookieValue = Cookies.get(AUTH_COOKIE);
    const cookieStatus = cookieValue
      ? JSON.parse(base64Decode(cookieValue)).status
      : null;

    if (String(cookieStatus) === "200") {
      setLoginInfo((prev) => ({
        ...prev,
        status: 200,
        statusMessage: "signed in",
      }));
      navigate("/");
    }
  }, []);

  /**
   * Listen to login status changes
   * Redirect to home if login is successful
   */
  useEffect(() => {
    if (String(loginInfo.status) === "200") {
      setLoginInfo((prev) => ({
        ...prev,
        status: 200,
        statusMessage: "signed in",
      }));
      navigate("/");
    }
  }, [loginInfo.status]);

  /* -------------------------- Render ---------------------------------- */

  return (
    <section className="flex flex-col justify-between items-center h-screen bg-splash-screen font-sans">
      {/* ------------------------- Main Login Box ------------------------ */}
      <div className="flex flex-col flex-1 items-center justify-center gap-2">
        {/* App Logo / Title */}
        <h1 className="ml-2 text-small-initial ff-montserrat text-clr-200/80">
          <span className="text-big-initial font-bold text-primary tracking-tight">
            AR
          </span>
          <span className="tracking-tighter">TAILORS</span>
        </h1>

        {/* Login Card */}
        <div className="w-dvw md:w-full bg-clr-100 p-8 md:px-10 shadow-md text-center">
          <h1 className="mb-4 text-heading-100 ff-montserrat font-bold uppercase text-clr-300">
            {loginInfo.statusMessage !== "" ? loginInfo.statusMessage : "Login"}
          </h1>

          <Form
            method="post"
            className="flex flex-col items-center gap-4"
            loginInputs={formInputs}
          >
            {/* Username */}
            <div className="text-left">
              <label
                htmlFor="username"
                className="block text-sm text-clr-300/80"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formInputs.username}
                onChange={(e) =>
                  setFormInputs({ ...formInputs, username: e.target.value })
                }
                required
                className="w-full max-w-67 p-3 border border-border-clr rounded-md text-clr-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div className="text-left">
              <label
                htmlFor="password"
                className="block text-sm text-clr-300/80"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formInputs.password}
                onChange={(e) =>
                  setFormInputs({ ...formInputs, password: e.target.value })
                }
                required
                className="w-full max-w-67 p-3 border border-border-clr rounded-md text-clr-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginInfo.status === "102"}
              className={`w-full max-w-67 p-3 rounded-md bg-primary text-white transition hover:bg-primary cursor-pointer ${
                loginInfo.status === "102" ? "opacity-85" : ""
              }`}
            >
              {loginInfo.status === "102" ? (
                <div className="flex w-full justify-center">
                  <Spinner spin css="fill-clr-100" width="24px" />
                </div>
              ) : (
                "Login"
              )}
            </button>
          </Form>
        </div>
      </div>

      {/* ------------------------- Footer Note ------------------------- */}
      <p className="mb-8 max-w-[30ch] px-1 text-center text-text-200 text-clr-100">
        Contact admin{" "}
        <a
          className="text-primary"
          href="mailto:arbazyousaf.dev@gmail.com"
          target="_blank"
          rel="noreferrer"
        >
          @arbazyousaf.dev
        </a>{" "}
        to gain access
      </p>
    </section>
  );
}
