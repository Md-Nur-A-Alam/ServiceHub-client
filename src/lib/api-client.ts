import axios from "axios";

const serverURL = process.env.SERVER_PRODUCTION_URL || process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || "http://localhost:8000";
const baseURL = serverURL.endsWith("/api/v1") ? serverURL : `${serverURL}/api/v1`;

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
