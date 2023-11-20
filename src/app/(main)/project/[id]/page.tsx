"use client";

import { getProject } from "@/util/projects/projects";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import { FaChevronRight } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import colors from "tailwindcss/colors";

const Skeleton = () => {
  // TODO
  return <BarLoader width="100%" className="mt-4" />;
};

const Page = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", params.id],
    queryFn: async () => {
      const project = await getProject(params.id);
      return project;
    },
  });

  if (isLoading) {
    return <Skeleton />;
  }

  const formatDate = (d: string) => {
    const date = new Date(d)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
      .split(" ")
      .join(" ");
    return date;
  };

  const keywords = ["keyword1", "keyword2", "keyword3", "keyword4"];
  const getColor = (index: number) => {
    const availableColors = [
      colors.rose[500],
      colors.teal[500],
      colors.cyan[500],
      colors.lime[500],
    ];

    return availableColors[index % availableColors.length];
  };

  return (
    <div>
      <div className="flex flex-row items-center gap-2 p-2 my-2 w-fit">
        <Link href="/" className="font-bold">
          Dashboard
        </Link>
        <FaChevronRight />
        <Link href={`/project/${project?._id}`}>{project?.name}</Link>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center text-5xl mt-2 mb-4 gap-4">
          <div className="font-light text-stone-500">Project:</div>
          <div className="font-bold text-stone-900">{project?.name}</div>
        </div>
        <div className="flex flex-row items-center gap-4 font-bold">
          <button className="flex flex-row items-center gap-2 border-2 border-gray-900 bg-gray-900 text-gray-100 px-4 py-2 rounded-md hover:bg-transparent hover:text-gray-900">
            <IoMdAddCircle />
            <span> Add keyword </span>
          </button>
          <button className="flex flex-row items-center gap-2 border-2 border-gray-900 bg-gray-900 text-gray-100 px-4 py-2 rounded-md hover:bg-transparent hover:text-gray-900">
            <MdEdit />
            <span>Edit project</span>
          </button>
        </div>
      </div>
      <div className="italic text-stone-500">
        Last Updated: {formatDate(project?.modification_time ?? "")}
      </div>
      <div className="flex flex-row items-center gap-2 text-lg">
        <div className="text-stone-700">Description:</div>
        <div className="text-stone-900 font-medium">{project?.description}</div>
      </div>
      <div className="flex flex-row gap-4">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className={`flex flex-row items-center gap-2 text-xs mt-4 w-fit px-2 py-1 rounded-md border-2`}
            style={{ borderColor: getColor(index), color: getColor(index) }}
          >
            {keyword}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
