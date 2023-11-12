import axiosMain from "axios";

export const http = axiosMain.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "X-SERVER": "next-js" },
});
