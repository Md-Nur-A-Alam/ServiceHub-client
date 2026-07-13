import axios from "axios";

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL as string;
const baseURL = serverURL.endsWith("/api/v1") ? serverURL : `${serverURL}/api/v1`;

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
