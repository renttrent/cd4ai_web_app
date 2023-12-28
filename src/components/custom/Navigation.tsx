"use client";

import { AiFillTool, AiFillFolder, AiFillBook } from "react-icons/ai";
import { BiSolidLogOut } from "react-icons/bi";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../ui/modetoggle";

const navButtonStyles = " text-white px-3  py-1 bg-gray-600   hover:bg-gray-800";

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
  const pathname = usePathname();
  return (
    <nav className="h-full bg-gray-900 flex flex-col justify-between py-10">
      <div className="flex flex-col gap-10 items-center ">
        <div className="w-20 h-auto px-1">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1338 259"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Fusionbase Word Logo</title>
            <g fill="none" fillRule="evenodd">
              <path
                d="M343.62 116.804h-15.003c-3.49 0-3.49-21.077 0-21.077h15.004V77.786c0-25.78 14.131-29.786 39.603-29.786h2.965c3.49 0 3.49 22.818 0 22.818h-2.965c-9.247 0-16.749-.696-16.749 8.536v16.373h19.714c3.49 0 3.49 21.077 0 21.077h-19.714v92.493c0 3.484-22.854 3.484-22.854 0v-92.493zm59.143-19.16c0-2.614 22.855-2.614 22.855 0v63.752c0 15.676 12.561 28.218 28.263 28.218h4.012c7.851 0 15.004-3.31 20.238-8.535V97.643c.174-2.613 22.854-2.613 22.854 0V209.82c0 2.787-22.68 2.787-22.68 0v-1.568c-6.455 2.787-13.259 4.18-20.412 4.18h-4.012c-28.263 0-51.118-22.818-51.118-51.036V97.643zm151.259 64.97l-.35-.173c-3.663-.174-10.99-1.394-17.62-5.574-7.502-4.877-13.782-13.413-13.957-26.128.175-13.587 6.804-22.993 16.05-28.567 8.375-5.051 18.32-6.445 26.17-6.445 14.306.174 26.518 3.31 35.241 7.142 5.758 2.613-3.489 23.69-9.246 21.076-6.106-2.612-15.178-5.225-25.995-5.4-5.583.175-10.991 1.22-14.48 3.31-2.792 1.742-4.71 4.006-4.71 8.884 0 4.006 1.57 5.748 3.314 6.793 2.442 1.568 5.408 1.916 6.106 2.09h.698c5.583.349 16.923 0 26.867 3.484 12.387 4.18 22.331 14.283 22.331 32.921-.349 16.2-9.42 28.393-25.471 33.444-14.655 4.355-34.37 2.613-58.096-4.006-6.106-1.742.174-23.864 6.28-22.122 22.157 6.27 36.812 6.445 45.012 4.006 6.804-2.09 9.246-5.748 9.246-11.67 0-4.355-1.046-6.62-1.919-7.664-.872-1.22-2.268-2.439-4.885-3.31-2.617-.87-5.931-1.393-9.77-1.742-2.093-.174-4.012-.174-5.757-.348h-5.06zm64.376-96.847c0-8.013 6.455-14.283 14.306-14.283h1.57c7.851 0 14.306 6.27 14.306 14.283v5.051c0 8.013-6.455 14.458-14.306 14.458h-1.57c-7.85 0-14.306-6.445-14.306-14.458v-5.05zm3.664 31.876c0-2.613 22.854-2.613 22.854 0v112.35c0 2.614-22.854 2.614-22.854 0V97.644zm40.475 49.12c0-28.217 22.855-51.036 51.118-51.036h4.012c28.263 0 51.118 22.819 51.118 51.037v14.109c0 28.218-22.855 51.037-51.118 51.037h-4.012c-28.263 0-51.118-22.819-51.118-51.037v-14.11zm83.393 0c0-15.502-12.561-28.217-28.263-28.217h-4.012c-15.702 0-28.263 12.715-28.263 28.218v14.109c0 15.503 12.56 28.218 28.263 28.218h4.012c15.702 0 28.263-12.715 28.263-28.218v-14.11zm40.3-41.978c15.528-5.922 25.821-9.058 47.105-9.058 28.263 0 51.118 22.819 51.118 51.037v62.533c0 3.484-22.855 3.484-22.855 0v-62.533c0-15.503-12.561-28.218-28.263-28.218h-4.012c-8.723.522-13.783 2.264-20.238 4.703v86.048c0 3.484-22.854 3.484-22.854 0V104.785zm213.891 41.979v14.109c0 28.218-22.854 51.037-51.117 51.037h-4.013c-7.153 0-14.131-1.394-20.237-4.18v1.567c0 3.484-22.855 3.484-22.855 0V50.787c0-3.484 22.855-3.484 22.855 0v47.03c6.804-1.393 14.305-2.09 24.25-2.09 28.263 0 51.117 22.819 51.117 51.037zm-75.367-23.515v57.307c5.059 5.226 12.212 8.535 20.237 8.535h4.013c15.527 0 28.263-12.541 28.263-28.218v-14.11c0-15.502-12.736-28.217-28.263-28.217h-4.013c-8.723.522-13.957 2.264-20.237 4.703zm168.704 84.48c-6.28 2.613-13.084 4.18-20.237 4.18h-4.187c-28.438 0-51.467-22.992-51.467-51.036v-14.11c0-28.217 23.03-51.036 51.467-51.036 21.458 0 31.926 3.136 47.453 9.058v104.512c0 3.484-23.029 3.484-23.029 0v-1.568zm0-84.48c-6.455-2.439-11.514-4.18-20.237-4.703h-4.187c-15.702 0-28.438 12.715-28.438 28.218v14.109c0 15.503 12.736 28.218 28.438 28.218h4.187c7.85 0 15.178-3.31 20.237-8.535V123.25zm76.066 39.366l-.35-.174c-3.663-.174-10.99-1.394-17.62-5.574-7.502-4.877-13.782-13.413-13.957-26.128.175-13.587 6.804-22.993 16.05-28.567 8.375-5.051 18.32-6.445 26.17-6.445 14.306.174 26.518 3.31 35.241 7.142 5.757 2.613-3.489 23.69-9.246 21.076-6.106-2.612-15.178-5.225-25.995-5.4-5.583.175-10.991 1.22-14.48 3.31-2.792 1.742-4.71 4.006-4.71 8.884 0 4.006 1.57 5.748 3.314 6.793 2.442 1.568 5.408 1.916 6.106 2.09h.698c5.583.349 16.923 0 26.867 3.484 12.387 4.18 22.331 14.283 22.331 32.921-.349 16.2-9.42 28.393-25.471 33.444-14.655 4.355-34.37 2.613-58.096-4.006-6.106-1.742.174-23.864 6.28-22.122 22.157 6.27 36.812 6.445 45.012 4.006 6.804-2.09 9.246-5.748 9.246-11.67 0-4.355-1.047-6.62-1.919-7.664-.872-1.22-2.268-2.439-4.885-3.31-2.617-.87-5.932-1.393-9.77-1.742-2.093-.174-4.012-.174-5.757-.348h-5.06zm115.494 49.295c-27.391-.174-51.118-22.47-51.118-51.037v-14.11c0-28.217 22.855-51.036 51.117-51.036h.873c28.263 0 51.117 22.819 51.117 51.037v5.574c0 5.748-1.221 12.019-4.71 12.019h-75.368c1.92 13.935 14.132 24.734 28.088 24.734h4.362c11.34 0 20.238-7.141 24.25-13.935 3.14-5.4 22.855 5.923 19.714 11.497-7.152 12.367-22.854 25.257-44.138 25.257h-4.188zm0-93.364c-14.48 0-26.519 10.973-28.089 25.083h57.05c-1.571-14.11-13.609-25.083-28.09-25.083h-.871z"
                fill="#FFF"
                fillRule="nonzero"
              />
              <path
                d="M70.826 128.4a434.754 434.754 0 00-.026 3.889c0 31.52 25.61 57.073 57.2 57.073 8.102 0 15.81-1.681 22.794-4.712v71.953A130.07 130.07 0 01129.2 258.4C57.845 258.4 0 200.555 0 129.2 0 78.82 28.836 35.175 70.903 13.869L70.826 128.4z"
                fill="#FF4A4A"
              />
              <path
                d="M105.309 2.205A129.916 129.916 0 01129.2 0c71.355 0 129.2 57.845 129.2 129.2 0 51.292-29.889 95.603-73.2 116.466l-.02-114.898c-.808-30.817-26.099-55.552-57.18-55.552a57.12 57.12 0 00-22.691 4.667V2.205z"
                fill="#4A89FF"
              />
            </g>
          </svg>
        </div>
        <Link
          href="/"
          className={cn(
            navButtonStyles,
            pathname.includes("project") && "bg-gray-300"
          )}
        >
          <div className="flex flex-row relative  gap-1 items-center">
            <AiFillFolder size={20} />
            Projects
          </div>
        </Link>
      </div>
      <div className="flex flex-col gap-4 items-center ">
        <ModeToggle/>
      <button
        onClick={() => {
          signOut();
        }}
        className={navButtonStyles}
      >
        <div className="flex flex-row relative items-center">
          <BiSolidLogOut size={20} />
          <div>Logout</div>
        </div>
      </button>
      </div>
    </nav>
  );
};
