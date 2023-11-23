"use client";

import { getProject } from "@/util/projects/projects";
import { useQueries } from "@tanstack/react-query";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import { FaChevronRight } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import colors from "tailwindcss/colors";
import { useState } from "react";
import { Class } from "@/types/types";
import ClassCard from "@/components/custom/ClassCard";
import { getClassesByProjectId } from "@/util/classes/classes";
import { CreateClassForm } from "./class/_ui/CreateClassForm";
import { useRouter } from "next/navigation";
import { XIcon } from "lucide-react";

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
  const [showCreateClass, setShowCreateClass] = useState(false);

  const nav = useRouter();
  const [projectQuery, classQuery] = useQueries({
    queries: [
      {
        queryKey: ["project", params.id],
        queryFn: async () => await getProject(params.id),
      },
      {
        queryKey: ["post", 2],
        queryFn: async () => await getClassesByProjectId(params.id),
      },
    ],
  });

  const isLoading = projectQuery.isLoading || classQuery.isLoading;

  const project = projectQuery.data;
  const classes = classQuery.data ?? [];
  if (isLoading) {
    return <Skeleton />;
  }

  if (!project) {
    return <div>Project not found</div>;
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
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-2 p-2 my-2 w-fit">
          <Link href="/" className="font-bold">
            Dashboard
          </Link>
          <FaChevronRight />
          <Link href={`/project/${project?.project_id}`}>{project?.name}</Link>
        </div>
        <div className="flex flex-row items-center gap-4 font-bold">
          <button
            onClick={() => setShowCreateClass(true)} // Open the create class popup on button click
            className="flex flex-row items-center gap-2 border-2 border-gray-900 bg-gray-900 text-gray-100 px-4 py-2 rounded-md hover:bg-transparent hover:text-gray-900"
          >
            <IoMdAddCircle />
            <span>Create Class</span>
          </button>
          <button className="flex flex-row items-center gap-2 border-2 border-gray-900 bg-gray-900 text-gray-100 px-4 py-2 rounded-md hover:bg-transparent hover:text-gray-900">
            <MdEdit />
            <span>Edit project</span>
          </button>
        </div>
      </div>
      <div className="text-stone-700">Description:</div>
      <div className="text-stone-900 font-medium">{project?.description}</div>
      <div className="text-stone-700">Files:</div>
      <div className="flex flex-row gap-4">
        {project?.files.map((file, index) => (
          <div
            key={index}
            className={`flex flex-row items-center gap-2 text-xs mt-4 w-fit px-2 py-1 rounded-md border-2`}
            style={{
              borderColor: getColor(index),
              color: getColor(index),
            }}
          >
            {file.file_name}
          </div>
        ))}
      </div>
      {showCreateClass && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-full mx-4 max-w-2xl">
            <div className="flex flex-row-reverse">
              <button onClick={() => setShowCreateClass(false)}>
                <XIcon />
              </button>
            </div>
            <CreateClassForm
              onSuccess={() => {
                classQuery.refetch();
                nav.refresh();
              }}
              projectId={project._id}
            />
          </div>
        </div>
      )}
      <div className="mt-8">
        {classes.map((classItem, index) => (
          <ClassCard key={index} classItem={classItem} />
        ))}
      </div>
    </div>
  );
};

export default Page;
