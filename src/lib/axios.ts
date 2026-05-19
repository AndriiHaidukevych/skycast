import axios from "axios";

export const apiClient = axios.create({
  baseURL: typeof window === "undefined" ? "http://localhost:3000" : "",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});
