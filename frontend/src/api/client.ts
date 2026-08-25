import axios, { type InternalAxiosRequestConfig } from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    Accept: "application/json",
  },
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const axiosError = error as {
      response?: { data?: { detail?: string } };
      message?: string;
    };
    const message =
      axiosError.response?.data?.detail ||
      axiosError.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default client;
