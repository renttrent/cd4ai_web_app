//Login ENDPOINT

import { User } from "@/types/types";
import { axios } from "../axios";

export const getUser = async (): Promise<User> => {
  const res = await axios.get("/user");

  if (res.status === 200) {
    return res.data?.body;
  }
  throw new Error(res.data?.body);
};
