//Login ENDPOINT

import { axios } from "../axios";

export type SignUpRequestParams = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
};

export const signUp = async (data: SignUpRequestParams) => {
  return await axios.post("/auth/register", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
