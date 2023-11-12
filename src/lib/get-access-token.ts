import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export const getAccessToken = async () => {
  const session = (await getSession()) as
    | (Session & { user: { server_token: string } })
    | null;

  return session?.user?.server_token;
};
