import { getAccessToken } from "@/lib/get-access-token";
import axiosMain from "axios";

const axios = axiosMain.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add a request interceptor
axios.interceptors.request.use(async function (config) {
  const token = await getAccessToken();
  config.headers.Authorization = "Bearer " + token;
  return config;
});

export { axios };
