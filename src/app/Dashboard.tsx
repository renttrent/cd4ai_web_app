"use client";

import { getUser } from "@/api/user/get-user";
import { Navigation } from "@/components/custom/Navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const Dashboard = () => {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const session = useSession();
  return (
    <div className="flex flex-row top-0 left-0 w-screen h-screen">
      <Navigation />
      <section className="w-full overflow-y-auto text-4xl"></section>
    </div>
  );
};
