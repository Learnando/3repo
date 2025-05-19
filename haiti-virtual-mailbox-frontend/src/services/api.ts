import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
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
