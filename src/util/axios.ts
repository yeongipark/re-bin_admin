import axios from "axios";
import { getToken } from "./cookie";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
apiClient.interceptors.request.use(
  (config) => {
    // 쿠키에서 토큰가져오기
    const token = getToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
