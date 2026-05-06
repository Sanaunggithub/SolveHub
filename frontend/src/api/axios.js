import axios from "axios";

const API_URL = "http://localhost:8000"; // FastAPI backend

// create reusable HTTP client
const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // add authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
