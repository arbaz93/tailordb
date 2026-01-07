// async function handleLogin() {
//     setLoginStatus("Signing in...")
//     if (formInputs.username === "" || formInputs.password === "") {
//       setLoginStatus("username or password is empty!")
//       return
//     } else {
//       const options = {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formInputs)
//       }
//       await fetch(API_URL+'/auth', options)
//       .then(res => res.json())
//       .then(data => {
//         if('_doc' in data) {
//           setLoginId(data['_doc']['_id'])
//           setPrevLogin(data['_doc']['_id'])
//         }
//         setLoginStatus(data.status)
//       })
//     }
//   }

//   export default handleLogin;

import Cookies from "js-cookie";
import { base64Encode, base64Decode } from "../utils/scripting";

const API_URL : string = import.meta.env.VITE_SERVER_LINK;

type FormInputs = {
  username: string;
  password: string;
};

type LoginResponse = {
  status: string;
  _doc?: {
    _id: string;
  };
};

async function handleLogin(
  formInputs: FormInputs,
  setLoginInfo: (loginInfo: any) => void,
) {
  try {
    // clear old auth
    Cookies.remove("t000");

    // basic validation
    if (!formInputs.username || !formInputs.password) {
      setLoginInfo((prev: any) => ({
        ...prev,
        status: "400",
        statusMessage: "username or password is empty!",
      }));
      return;
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formInputs),
    };

    setLoginInfo((prev: any) => ({
      ...prev,
      status: "102",
      statusMessage: "Signing In...",
    }));

    const res = await fetch(`${API_URL}/auth`, options);

    // handle HTTP errors
    if (!res.ok) {
      setLoginInfo((prev: any) => ({
        ...prev,
        status: String(res.status),
        statusMessage: res.statusText || "Login failed",
      }));
      Cookies.remove("t000");
      return;
    }

    let data: LoginResponse;

    try {
      data = await res.json();
    } catch {
      setLoginInfo((prev: any) => ({
        ...prev,
        status: "500",
        statusMessage: "Invalid server response",
      }));
      Cookies.remove("t000");
      return;
    }

    if (data?._doc) {
      Cookies.set(
        "t000",
        base64Encode(
          JSON.stringify({
            _id: data._doc._id,
            username: data._doc._id,
            status: "200",
            statusMessage: "logged In",
          })
        )
      );

      setLoginInfo((prev: any) => ({
        ...prev,
        status: "200",
        statusMessage: "logged In",
      }));
    } else {
      setLoginInfo((prev: any) => ({
        ...prev,
        status: "500",
        statusMessage: data?.status || "something went wrong!",
      }));
      Cookies.remove("t000");
    }
  } catch (error: any) {
    // network / unexpected errors
    setLoginInfo((prev: any) => ({
      ...prev,
      status: "500",
      statusMessage: error?.message || "Network error",
    }));
    Cookies.remove("t000");
  }
}

function getAuthStatus() {
  try {
    const token = Cookies.get("t000");
    if (!token) return "404";

    const parsed = JSON.parse(base64Decode(token));
    return parsed?.status ?? "404";
  } catch {
    Cookies.remove("t000");
    return "404";
  }
}


export { handleLogin, getAuthStatus };
