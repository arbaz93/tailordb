import axios from "axios";
import { createContactIndex } from "~/lunr/lunrFunctions";
import { useContactStore } from "~/zustand/contactStore";
import { useNotificationStore } from "~/zustand/notificationStore";

const API_URL = import.meta.env.VITE_SERVER_LINK;

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type Measurements = Record<string, unknown>;

type ApiSuccess<T> = {
  data: T;
  status: number;
  statusText: string;
};

type ApiError = {
  status: number;
  message: string;
};

type ApiResult<T> = ApiSuccess<T> | ApiError;


/* ------------------------------------------------------------------ */
/* Show Notification Helper */
/* ------------------------------------------------------------------ */
type NotificationStatusType = "success" | "error" | "processing" | "warning";

type NotificationPropsType = {
  text?: string;
  status?: number;
  type?: NotificationStatusType; // ✅ fixed
  displayModal?: boolean;        // ✅ lowercase 'boolean'
}

const defaultNotificationTime = 4000;
function setNotification({
  text,
  status,
  type,
  displayModal
}: NotificationPropsType) {
  useNotificationStore.setState((state) => ({
    notification: {
      ...state.notification,
      text: text ?? state.notification.text,
      status: status ?? state.notification.status,
      type: type ?? state.notification.type,
      displayModal: displayModal ?? state.notification.displayModal,
    },
  }));
}

function hideNotificationAfterTime(time:number) {
  setTimeout(() => setNotification({ displayModal:false }), time)
}
/* ------------------------------------------------------------------ */
/* Shared Axios error handler */
/* ------------------------------------------------------------------ */

function handleAxiosError(err: unknown, fallbackMessage = "Request failed"): ApiError {
  setNotification({type:"error", displayModal: true})
  const timeout = setTimeout(() => {
    setNotification({ displayModal: false })
  }, 5000)

  if (axios.isAxiosError(err)) {

    if (err.response) {
      const errMessage = err.response.data?.error ??
        err.response.data?.message ??
        err.response.statusText ??
        fallbackMessage;

      setNotification({
        text: errMessage,
        status: err.response.status,
        displayModal: true
      })

      return {
        status: err.response.status,
        message: errMessage
      };
    }

    if (err.request) {
      clearTimeout(timeout)
      setNotification({ status: 503, type:"error", text: "Unable to reach server. Check your connection." })
      return {
        status: 503,
        message: "Unable to reach server. Check your connection.",
      };
    }
    setNotification({ status: 500, text: err.message || "Request configuration error" })
    return {
      status: 500,
      message: err.message || "Request configuration error",
    };
  }

  if (err instanceof Error) {
    setNotification({ status: 500, text: err.message || "Request configuration error" })

    return { status: 500, message: err.message };
  }
  setNotification({ status: 500, text: "Unknown error occurred" })
  return { status: 500, message: "Unknown error occurred" };
}

/* ------------------------------------------------------------------ */
/* Contacts */
/* ------------------------------------------------------------------ */

async function upsertContact(payload: {
  id?: string;
  name: string;
  phone: string;
  code?: string;
}): Promise<ApiResult<any>> {

  if (!payload.name) {
    return { status: 400, message: "Name is required" };
  }

  if (!payload.phone) {
    return { status: 400, message: "Phone is required" };
  }

  try {
    setNotification({
      text: 'saving contact',
      status: 102,
      type: "processing",
      displayModal: true
    })

    const res = await axios.post(`${API_URL}/contacts/upsert`, payload);
    useContactStore.getState().addContact(res.data);
    
    setNotification({
      text: 'saved contact successfully!',
      status: 200,
      type: "success",
      displayModal: true
    })

    hideNotificationAfterTime(defaultNotificationTime)
    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (err) {
    return handleAxiosError(err);
  }
}

async function getContacts(): Promise<ApiResult<any>> {
  const { setAllContacts, setContactLoadStatus, setIndex } =
    useContactStore.getState();

  try {
    setContactLoadStatus("loading");
    setNotification({ text:"fetching contacts", type:"processing", status: 102})
    const res = await axios.get(`${API_URL}/contacts`);
    setNotification({ text:"contacts retrieved", type:"success", status: 200})

    setAllContacts(res.data);
    setIndex(createContactIndex(res.data));
    setContactLoadStatus("loaded");

    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (err:any) {
    console.error("getContacts error:", err);
    setAllContacts([]);
    setContactLoadStatus("error");

    return handleAxiosError(err);
  }
}

async function deleteContactWithMeasurements(
  id: string
): Promise<ApiResult<any>> {
  try {
    setNotification({ text:"deleting contact...", type:"processing", status: 102, displayModal:true})
    const res = await axios.delete(
      `${API_URL}/deleteContactWithMeasurements/${id}`
    );
    useContactStore.getState().removeContact(id)
    setNotification({ text:"contact deleted!", type:"success", status: 200})

    hideNotificationAfterTime(defaultNotificationTime)
    return {
      data: res.data,
      status: res.status,
      statusText: "Contact Deleted!",
    };
  } catch (err) {
    console.error("deleteContactWithMeasurements error:", err);
    return handleAxiosError(err, "Delete failed");
  }
}

/* ------------------------------------------------------------------ */
/* Measurements */
/* ------------------------------------------------------------------ */

async function getMeasurements(id: string): Promise<ApiResult<any>> {
  try {
    const res = await axios.get(`${API_URL}/measurements/${id}`);

    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (err:any) {
    if(err?.status === 404) {
      return {status:err?.status, message: err?.statusText};
    }
    return handleAxiosError(err);
  }
}

async function saveMeasurements(payload: {
  id: string;
  measurements: Measurements;
}): Promise<ApiResult<any>> {
  try {
    setNotification({ text:"saving measurements", type:"processing", status: 102, displayModal:true})

    const res = await axios.put(
      `${API_URL}/measurements/${payload.id}`,
      { measurements: payload.measurements }
    );
    setNotification({ text:"measurements saved", type:"success", status: res.status})
    hideNotificationAfterTime(defaultNotificationTime)
    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (err) {
    return handleAxiosError(err);
  }
}

async function saveContactAndMeasurements(payload: {
  id?: string;
  name: string;
  phone: string;
  code?: string;
  measurements: Measurements;
}): Promise<ApiResult<any>> {
  try {
    setNotification({ text:"saving contact", type:"processing", status: 102, displayModal: true})

    const res = await axios.post(
      `${API_URL}/contacts/save-with-measurements`,
      payload
    )
    useContactStore.getState().addContact(res.data.contact)
    setNotification({ text:res.statusText, type:"success", status: res.status})
    hideNotificationAfterTime(defaultNotificationTime)
    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (err) {
    return handleAxiosError(err);
  }
}

/* ------------------------------------------------------------------ */
/* Exports */
/* ------------------------------------------------------------------ */

export {
  getContacts,
  upsertContact,
  deleteContactWithMeasurements,
  getMeasurements,
  saveMeasurements,
  saveContactAndMeasurements,
};
