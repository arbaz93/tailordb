import axios from 'axios';
import { createContactIndex } from "~/lunr/lunrFunctions";
import { useContactStore } from '~/zustand/contactStore';

const API_URL: string = import.meta.env.VITE_SERVER_LINK;

interface CustomError extends Error {
  status: number;
}

async function getContacts() {
  const { setAllContacts, setContactLoadStatus } = useContactStore.getState();
  try {
    // ✅ Access Zustand store WITHOUT a hook
    const { setIndex } = useContactStore.getState();
    setContactLoadStatus('loading')

    const res = await axios.get(`${API_URL}/getContacts`);

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

export { getContacts };
