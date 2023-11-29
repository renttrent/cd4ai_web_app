"use client";

import { useSession } from "next-auth/react";
import { AddProjectButton } from "./AddProjectModal";
import { useEffect, useState } from "react";

export const Header = () => {
  const session = useSession();
  const [user, setUser] = useState(session.data?.user);

  useEffect(() => {
    setUser(session.data?.user);
  }, [session]);

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="text-4xl font-medium">{`Hi ${
        user?.firstname ?? ""
      }!`}</div>

      <AddProjectButton />
    </div>
  );
};
