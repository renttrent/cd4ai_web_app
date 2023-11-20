//Login ENDPOINT

import { axios } from "../axios";

export const getUser = async () => {
  return await axios.get("/user");
};
