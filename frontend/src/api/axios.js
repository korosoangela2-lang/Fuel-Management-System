import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Unwrap the backend's { error: { code, message, details } } envelope into a
// plain Error so callers can just read err.message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error.response?.data?.error;
    if (apiError) {
      const wrapped = new Error(apiError.message);
      wrapped.code = apiError.code;
      wrapped.details = apiError.details;
      wrapped.status = error.response.status;
      return Promise.reject(wrapped);
    }
    return Promise.reject(error);
  }
);

export default api;
