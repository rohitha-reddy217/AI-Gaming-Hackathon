import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true
});

let csrfToken: string | undefined;

api.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers["x-csrf-token"] = csrfToken;
  }
  try {
    const storeData = localStorage.getItem("user-store");
    if (storeData) {
      const parsed = JSON.parse(storeData);
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {}
  return config;
});

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const initCsrf = async () => {
  if (csrfToken) return csrfToken;
  const res = await api.get("/auth/csrf");
  csrfToken = res.data.csrfToken;
  return csrfToken;
};
