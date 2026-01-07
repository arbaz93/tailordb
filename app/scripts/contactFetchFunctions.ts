import axios from 'axios';
import { createContactIndex } from "~/lunr/lunrFunctions";
import { useLunrIndexStore } from '~/zustand/lunrIndexStore';
const API_URL: string = import.meta.env.VITE_SERVER_LINK;

interface CustomError extends Error {
  status: number;
}

async function getContacts() {
  try {
    // ✅ Access Zustand store WITHOUT a hook
    const { setIndex } = useLunrIndexStore.getState();

    const res = await axios.get(`${API_URL}/getContacts`);

    setIndex(createContactIndex(res?.data));

    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (err: unknown) {
    console.error(err);

    if (err && typeof err === 'object' && 'message' in err) {
      const e = err as CustomError;
      return { status: e.status ?? 500, message: e.message };
    }

    return { status: 500, message: 'Unknown error' };
  }
}

export { getContacts };
