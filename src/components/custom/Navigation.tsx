import { AiFillTool, AiFillFolder, AiFillBook } from "react-icons/ai";
import { BiSolidLogOut } from "react-icons/bi";

import Link from "next/link";
import { signOut } from "next-auth/react";

export const Navigation = () => {
  return (
    <nav className="h-full bg-indigo-500">
      <div className="flex flex-col gap-10 mt-24 items-center">
        <Link
          href="/"
          className="m-2 p-2 text-white bg-indigo-700 rounded-full hover:bg-indigo-600"
        >
          <AiFillTool size={20} />
        </Link>
        <Link
          href="/"
          className="m-2 p-2 text-white bg-indigo-400 rounded-full hover:bg-indigo-600"
        >
          <AiFillFolder size={20} />
        </Link>
        <Link
          href="/"
          className="m-2 p-2 text-white bg-indigo-400 rounded-full hover:bg-indigo-600"
        >
          <AiFillBook size={20} />
        </Link>
      </div>
      <button
        onClick={() => {
          signOut();
        }}
        className="absolute bottom-3 m-2 p-2 text-white bg-indigo-400 rounded-full hover:bg-indigo-600"
      >
        <BiSolidLogOut size={20} />
      </button>
    </nav>
  );
};
