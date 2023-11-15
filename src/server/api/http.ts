import axiosMain from "axios";

export const http = axiosMain.create({
  baseURL: "http://localhost:8000/",
  timeout: 10000,
  headers: { "X-SERVER": "next-js" },
});
