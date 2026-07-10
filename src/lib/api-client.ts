import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL 
  ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1` 
  : "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
