"use client";

import { AiFillTool, AiFillFolder, AiFillBook } from "react-icons/ai";
import { BiSolidLogOut } from "react-icons/bi";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

const navButtonStyles =
  "m-2 p-2 text-white bg-violet-700 rounded-full hover:bg-violet-600";

const Helper = ({ content, active }: { content: string; active: boolean }) => {
  return (
    <div
      className={`${
        active
          ? "absolute left-12 w-24 text-center font-medium border border-violet-300 px-4 py-2 bg-violet-100 text-stone-800 text-xs rounded-md"
          : "hidden"
      }`}
    >
      {content}
    </div>
  );
};

export const Navigation = () => {
  const [activeNavs, setActiveNavs] = useState([false, false, false, false]);
  const changeActiveNavs = (index: number) => {
    const newActiveNavs = activeNavs.map(() => false);
    newActiveNavs[index] = true;
    setActiveNavs(newActiveNavs);
  };

  return (
    <nav className="h-full bg-gray-900 px-1 flex flex-col justify-between py-10">
      <div className="flex flex-col gap-10 items-center mt-12">
        <Link
          href="/"
          className={navButtonStyles}
          onMouseOver={() => changeActiveNavs(0)}
          onMouseLeave={() => setActiveNavs(activeNavs.map(() => false))}
        >
          <div className="flex flex-row relative items-center">
            <AiFillTool size={20} />
            <Helper content="Workbench" active={activeNavs[0]} />
          </div>
        </Link>
        <Link
          href="/"
          className={navButtonStyles}
          onMouseOver={() => changeActiveNavs(1)}
          onMouseLeave={() => setActiveNavs(activeNavs.map(() => false))}
        >
          <div className="flex flex-row relative items-center">
            <AiFillFolder size={20} />
            <Helper content="Projects" active={activeNavs[1]} />
          </div>
        </Link>
        <Link
          href="/"
          className={navButtonStyles}
          onMouseOver={() => changeActiveNavs(2)}
          onMouseLeave={() => setActiveNavs(activeNavs.map(() => false))}
        >
          <div className="flex flex-row relative items-center">
            <AiFillBook size={20} />
            <Helper content="Files" active={activeNavs[2]} />
          </div>
        </Link>
      </div>
      <button
        onClick={() => {
          signOut();
        }}
        className={navButtonStyles}
        onMouseOver={() => changeActiveNavs(3)}
        onMouseLeave={() => setActiveNavs(activeNavs.map(() => false))}
      >
        <div className="flex flex-row relative items-center">
          <BiSolidLogOut size={20} />
          <Helper content="Log Out" active={activeNavs[3]} />
        </div>
      </button>
    </nav>
  );
};
