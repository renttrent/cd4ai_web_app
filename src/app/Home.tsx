"use client";

import { getUser } from "@/api/user/get-user";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const HomeClient = () => {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const session = useSession();
  return (
    <div>
      {JSON.stringify(query.data?.data)}

      <div>session: {JSON.stringify(session.data)}</div>
    </div>
  );
};
