import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://haiti-backend.onrender.com/api";

console.log("📦 API Base URL:", baseURL); // ✅ Debug log

const api = axios.create({
  baseURL,
});

// ✅ Interceptor to automatically attach Authorization header
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("haitiUser");
  if (userInfo && config.headers) {
    const user = JSON.parse(userInfo);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default api;
