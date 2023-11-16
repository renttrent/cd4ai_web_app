import { useSession } from "next-auth/react";
import React from "react";
import { AiFillFileAdd } from "react-icons/ai";

interface HeaderProps {
  onAddProjectClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddProjectClick }) => {
  const session = useSession();
  //TODO: fix types
  const user = session.data?.user;
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="text-4xl font-medium">{`Hi ${
        user?.firstname ?? ""
      }!`}</div>
      <button
        onClick={onAddProjectClick}
        className="flex gap-2 items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        <AiFillFileAdd />
        <span>Add Project</span>
      </button>
    </div>
  );
};
