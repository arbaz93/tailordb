import axios, { AxiosError } from 'axios';
import { createContactIndex } from "~/lunr/lunrFunctions";
import { useContactStore } from '~/zustand/contactStore';

const API_URL: string = import.meta.env.VITE_SERVER_LINK;

interface CustomError extends Error {
  status: number;
}

async function upsertContact(payload: {
  id?: string;
  name: string;
  phone: string;
  code?: string;
}) {
  return axios.post(`${API_URL}/contacts/upsert`, payload);
}

async function getContacts() {
  const { setAllContacts, setContactLoadStatus } = useContactStore.getState();
  try {
    // ✅ Access Zustand store WITHOUT a hook
    const { setIndex } = useContactStore.getState();
    setContactLoadStatus('loading')

    const res = await axios.get(`${API_URL}/contacts`);

    setAllContacts(res?.data);
    setContactLoadStatus('loaded')
    setIndex(createContactIndex(res?.data));

    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (err: unknown) {
    console.error(err);
    setAllContacts([]);
    setContactLoadStatus('error')

    if (err && typeof err === 'object' && 'message' in err) {
      const e = err as CustomError;
      return { status: e.status ?? 500, message: e.message };
    }

    return { status: 500, message: 'Unknown error' };
  }
}

async function deleteContactWithMeasurements(id:string) {
  const { setAllContacts, setContactLoadStatus } = useContactStore.getState();
  try {

    const res = await axios.delete(`${API_URL}/deleteContactWithMeasurements/${id}`);


    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (err: unknown) {
    console.error(err);
    setAllContacts([]);
    setContactLoadStatus('error')

    if (err && typeof err === 'object' && 'message' in err) {
      const e = err as CustomError;
      return { status: e.status ?? 500, message: e.message };
    }

    return { status: 500, message: 'Unknown error' };
  }
}


interface ApiResponse<T> {
  data?: T;
  status: number;
  message: string;
}

// You should strongly type this later
export type Measurements = Record<string, any>;

async function getMeasurements(id: string): Promise<{
  data?: any;
  status: number;
  message: string;
}> {
  try {
    const res = await axios.get(`${API_URL}/measurements/${id}`);

    return {
      data: res.data,
      status: res.status,
      message: "OK",
    };
  } catch (err: unknown) {
    // Axios error
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;

      if (status !== 404) {
        console.error("getMeasurements error:", err);
      }

      if (err.response) {
        return {
          status: err.response.status,
          message:
            err.response.data?.error ??
            err.response.statusText ??
            "Request failed",
        };
      }

      if (err.request) {
        return {
          status: 503,
          message: "Unable to reach server. Check your connection.",
        };
      }

      return {
        status: 500,
        message: err.message || "Request configuration error",
      };
    }

    // Non-Axios error
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
  console.log(payload.id)
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
async function saveContactAndMeasurements(payload: {
  id?: string;
  name: string;
  phone: string;
  code?: string;
  measurements: Record<string, any>;
}) {
  const res = await axios.post(
    `${API_URL}/contacts/save-with-measurements`,
    payload
  );

  return res.data;
}

export { getContacts, deleteContactWithMeasurements, getMeasurements, saveMeasurements, saveContactAndMeasurements, upsertContact };
