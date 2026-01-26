import axios from 'axios';

const API_URL: string = import.meta.env.VITE_SERVER_LINK;

interface CustomError extends Error {
  status: number;
}

async function getMeasurements(id: string) {
  try {
    const res = await axios.get(`${API_URL}/getMeasurements`, {
      params: { id }
    });

    return {
      data: res.data,
      status: res.status,
      message: res.statusText,
    };
  } catch (err: unknown) {
    console.error(err);

    if (err && typeof err === "object" && "message" in err) {
      const e = err as CustomError;
      return { status: e.status ?? 500, message: e.message };
    }

    return { status: 500, message: "Unknown error" };
  }
}

async function addMeasurements(payload: {
  id: string;
  measurements: any; // strongly type this if possible
}) {
  try {
    const res = await axios.post(`${API_URL}/addMeasurements`, payload);

    console.log(res);

    return {
      data: res.data,
      status: res.status,
      message: res.statusText,
    };
  } catch (err: unknown) {
    console.error(err);

    if (err && typeof err === "object" && "message" in err) {
      const e = err as CustomError;
      return { status: e.status ?? 500, message: e.message };
    }

    return { status: 500, message: "Unknown error" };
  }
}

export { getMeasurements, addMeasurements };
