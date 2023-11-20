"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { AiFillFileAdd } from "react-icons/ai";
import { AddProjectModal } from "./AddProjectModal";

export const Header = () => {
  const session = useSession();
  const user = session.data?.user;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="text-4xl font-medium">{`Hi ${
        user?.firstname ?? ""
      }!`}</div>
      <button
        className="flex gap-2 items-center bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        onClick={() => setShowModal(true)}
      >
        <AiFillFileAdd />
        <span>Add Project</span>
      </button>
      {showModal && <AddProjectModal onClose={() => setShowModal(false)} />}
    </div>
  );
};
