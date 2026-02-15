/**
 * Authentication utilities
 * - handleLogin: logs in user, updates store, sets cookie
 * - handleLogout: clears cookie and reloads
 * - getAuthStatus: reads login status from cookie
 */

import Cookies from "js-cookie";
import { base64Encode, base64Decode } from "../utils/scripting";
import { AUTH_COOKIE } from "~/utils/constants";
import { useNotificationStore } from "~/zustand/notificationStore";

/* API URL from env */
const API_URL: string = import.meta.env.VITE_SERVER_LINK;

/* ----------------------------- Types ---------------------------------- */

type FormInputs = {
  username: string;
  password: string;
};

type LoginResponse = {
  status: string;
  id: string;
  username: string;
  message: string;
};

/* ----------------------------- Login ---------------------------------- */

/**
 * Logs in a user
 * @param formInputs username and password
 * @param setLoginInfo Zustand setter for login store
 */
async function handleLogin(
  formInputs: FormInputs,
  setLoginInfo: (loginInfo: any) => void
) {
  // Clear any previous auth cookie
  Cookies.remove(AUTH_COOKIE);

  const { username, password } = formInputs;

  /* ------------------------- Basic Validation ------------------------ */
  if (!username || !password) {
    useNotificationStore.setState({
      notification: {
        text: "Username and password are required",
        status: 200,
        type: "warning",
        displayModal: true,
      },
    });

    // Hide notification after 4s
    setTimeout(() => {
      useNotificationStore.setState((state) => ({
        notification: { ...state.notification, displayModal: false },
      }));
    }, 4000);

    setLoginInfo({
      status: 400,
      statusMessage: "Username and password are required",
    });

    throw { status: 400, message: "Username and password are required" };
  }

  /* ----------------------- Start Login Process ----------------------- */
  useNotificationStore.setState({
    notification: {
      text: "Signing In",
      status: 200,
      type: "processing",
      displayModal: false,
    },
  });

  setLoginInfo({
    status: 102,
    statusMessage: "Signing in...",
  });

  /* ------------------------- Fetch Request --------------------------- */
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    /* ------------------------ Handle Error ---------------------------- */
    if (!res.ok) {
      useNotificationStore.setState({
        notification: {
          text: data?.message || "Login failed",
          status: res.status,
          type: "error",
          displayModal: true,
        },
      });

      setLoginInfo({
        status: res.status,
        statusMessage: data?.message || "Login failed",
      });

      Cookies.remove(AUTH_COOKIE);
      throw { status: res.status, message: data.message || "Login failed!" };
    }

    /* ------------------------ Handle Success -------------------------- */
    const loginPayload = {
      id: data.id,
      username: data.username,
      status: 200,
      statusMessage: "Logged in",
    };

    useNotificationStore.setState({
      notification: {
        text: data?.message || "Login success!",
        status: 200,
        type: "success",
        displayModal: true,
      },
    });

    setTimeout(() => {
      useNotificationStore.setState((state) => ({
        notification: { ...state.notification, displayModal: false },
      }));
    }, 4000);

    Cookies.set(AUTH_COOKIE, base64Encode(JSON.stringify(loginPayload)), {
      expires: 7,
      sameSite: "Lax",
      // secure: true,
    });

    setLoginInfo({
      status: 200,
      statusMessage: data.message || "Login successful!",
    });

    return { status: 200, statusMessage: data.message || "Login successful!" };
  } catch (err: any) {
    /* ------------------------ Network / Unexpected -------------------- */
    useNotificationStore.setState({
      notification: {
        text: err?.message || "Network error",
        status: 500,
        type: "error",
        displayModal: true,
      },
    });

    setLoginInfo({
      status: 500,
      statusMessage: err?.message || "Network error",
    });

    Cookies.remove(AUTH_COOKIE);
    return { status: 500, statusMessage: err?.message || "Network error" };
  }
}

/* ----------------------------- Logout --------------------------------- */

/**
 * Logs out user by clearing cookie and reloading the page
 */
async function handleLogout() {
  try {
    useNotificationStore.setState({
      notification: {
        text: "Logging out!",
        status: 200,
        type: "processing",
        displayModal: true,
      },
    });

    setTimeout(async () => {
      await Cookies.remove(AUTH_COOKIE);

      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }, 1200);

    return { status: 200, statusMessage: "Logout success" };
  } catch (err: any) {
    useNotificationStore.setState({
      notification: {
        text: "Failed to logout!",
        status: 500,
        type: "error",
        displayModal: true,
      },
    });

    setTimeout(() => {
      useNotificationStore.setState((state) => ({
        notification: { ...state.notification, displayModal: false },
      }));
    }, 4000);

    return { status: 500, statusMessage: "Failed to logout!" };
  }
}

/* -------------------------- Auth Status ------------------------------- */

/**
 * Reads auth cookie and returns login status code
 */
function getAuthStatus() {
  try {
    const token = Cookies.get(AUTH_COOKIE);

    if (!token) return 404;

    const parsed = JSON.parse(base64Decode(token));
    return parsed?.status ?? 404;
  } catch {
    Cookies.remove(AUTH_COOKIE);
    return 404;
  }
}

/* ----------------------------- Exports -------------------------------- */

export { handleLogin, handleLogout, getAuthStatus };
