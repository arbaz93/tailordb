import Cookies from "js-cookie";
import { base64Encode, base64Decode } from "../utils/scripting";
import { AUTH_COOKIE } from "~/utils/constants";

const API_URL : string = import.meta.env.VITE_SERVER_LINK;

type FormInputs = {
  username: string;
  password: string;
};


type LoginResponse = {
  status: string,
  id: string,
  username: string,
  message: string
};

async function handleLogin(
  formInputs: FormInputs,
  setLoginInfo: (loginInfo: any) => void
) {
  // clear old auth
  Cookies.remove(AUTH_COOKIE);

  const { username, password } = formInputs;

  // basic validation
  if (!username || !password) {
    setLoginInfo({
      status: 400,
      statusMessage: "Username and password are required",
    });
    return;
  }

  setLoginInfo({
    status: 102,
    statusMessage: "Signing in...",
  });

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json(); // always read body

    if (!res.ok) {
      setLoginInfo({
        status: res.status,
        statusMessage: data?.message || "Login failed",
      });
      Cookies.remove(AUTH_COOKIE);
      return;
    }

    // ✅ success
    const loginPayload = {
      id: data.id,
      username: data.username,
      status: 200,
      statusMessage: "Logged in",
    };

    Cookies.set(
      AUTH_COOKIE,
      base64Encode(JSON.stringify(loginPayload)),
      {
        expires: 7,
        sameSite: 'Lax',
        secure: true
      }
    )

    setLoginInfo({
      status: 200,
      statusMessage: data.message || "Logged in",
    });
  } catch (err: any) {
    setLoginInfo({
      status: 500,
      statusMessage: err?.message || "Network error",
    });
  Cookies.remove(AUTH_COOKIE);
  }
}
async function handleLogout() {
  try {
    await Cookies.remove(AUTH_COOKIE)
    if(window) {
      window.location.reload()
    }
  } catch(err) {
    console.error('failed to logout!')
  }
}


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


export { handleLogin, handleLogout, getAuthStatus };







