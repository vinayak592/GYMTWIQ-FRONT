import axios from "axios";

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl || typeof envUrl !== "string") return "/api";
  const trimmed = envUrl.trim();
  if (trimmed === "http://" || trimmed === "https://" || trimmed.length <= 8) {
    return "/api";
  }
  return trimmed;
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("gymtwiq_access_token") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An error occurred";
    let code = "UNKNOWN_ERROR";
    if (error.response?.data?.error) {
      message = error.response.data.error.message || message;
      code = error.response.data.error.code || code;
    } else if (error.message) {
      message = error.message;
    }
    const customError = new Error(message);
    (customError as any).code = code;
    (customError as any).status = error.response?.status;
    return Promise.reject(customError);
  }
);
