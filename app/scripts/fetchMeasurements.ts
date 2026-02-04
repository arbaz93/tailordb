import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_SERVER_LINK;

interface ApiResponse<T> {
  data?: T;
  status: number;
  message: string;
}

// You should strongly type this later
export type Measurements = Record<string, any>;

async function getMeasurements(id: string): Promise<ApiResponse<Measurements>> {
  try {
    const res = await axios.get(`${API_URL}/measurements/${id}`);

    return {
      data: res.data,
      status: res.status,
      message: "OK",
    };
  } catch (err: unknown) {
    console.error("getMeasurements error:", err);

    // Axios error (request made)
    if (axios.isAxiosError(err)) {
      // Server responded with a status code
      if (err.response) {
        return {
          status: err.response.status,
          message:
            err.response.data?.error ??
            err.response.statusText ??
            "Request failed",
        };
      }

      // Request made but no response (network / CORS / timeout)
      if (err.request) {
        return {
          status: 503,
          message: "Unable to reach server. Check your connection.",
        };
      }

      // Something went wrong setting up the request
      return {
        status: 500,
        message: err.message || "Request configuration error",
      };
    }

    // Non-Axios error (should be rare)
    if (err instanceof Error) {
      return {
        status: 500,
        message: err.message,
      };
    }

    return {
      status: 500,
      message: "Unknown error occurred",
    };
  }
}

async function saveMeasurements(payload: {
  id: string;
  measurements: Measurements;
}): Promise<ApiResponse<Measurements>> {
  try {
    const res = await axios.put(
      `${API_URL}/measurements/${payload.id}`,
      { measurements: payload.measurements }
    );

    return {
      data: res.data,
      status: res.status,
      message: res.statusText,
    };
  } catch (err) {
    console.error(err);

    if (axios.isAxiosError(err)) {
      return {
        status: err.response?.status ?? 500,
        message: err.response?.data?.error ?? err.message,
      };
    }

    return { status: 500, message: "Unknown error" };
  }
}

// async function deleteMeasurements(id: string): Promise<ApiResponse<null>> {
//   try {
//     const res = await axios.delete(`${API_URL}/measurements/${id}`);

//     return {
//       status: res.status,
//       message: res.statusText,
//     };
//   } catch (err) {
//     console.error(err);

//     if (axios.isAxiosError(err)) {
//       return {
//         status: err.response?.status ?? 500,
//         message: err.response?.data?.error ?? err.message,
//       };
//     }

//     return { status: 500, message: "Unknown error" };
//   }
// }


export { getMeasurements, saveMeasurements };
