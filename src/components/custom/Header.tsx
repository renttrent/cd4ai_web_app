"use client";

import { useSession } from "next-auth/react";
import { AddProjectButton } from "./AddProjectModal";

export const Header = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="text-4xl font-medium">{`Hi ${
        user?.firstname ?? ""
      }!`}</div>

      <AddProjectButton />
    </div>
  );
};
