"use client";

import { getProject } from "@/util/projects/projects";
import { useQueries } from "@tanstack/react-query";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import { FaChevronRight } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import ClassCard from "@/components/custom/ClassCard";
import { getClassesByProjectId } from "@/util/classes/classes";
import { CreateClassForm } from "./class/_ui/CreateClassForm";
import { useRouter } from "next/navigation";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

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

  const [project, setProject] = useState(projectQuery.data);
  const [classes, setClasses] = useState(classQuery.data ?? []);

  useEffect(() => {
    setProject(projectQuery.data);
    setClasses(classQuery.data ?? []);
  }, [projectQuery, classQuery]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <div className="flex flex-row items-center gap-2 p-2 my-2 w-fit">
        <Link href="/" className="font-bold">
          Dashboard
        </Link>
        <FaChevronRight />
        <Link href={`/project/${project?.id}`}>{project.name}</Link>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center text-5xl mt-2 mb-4 gap-4">
          <div className="font-light text-stone-500">Project:</div>
          <div className="font-bold text-stone-900">{project?.name}</div>
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
      <div className="flex flex-col gap-2">
        <div className="italic text-stone-500">
          Last Updated: {formatDate(project?.modification_time ?? "")}
        </div>
        <div className="text-stone-700">Description:</div>
        <div className="text-stone-900 font-medium">{project.description}</div>
        <div className="flex flex-row gap-2 my-2">
          <div className="text-stone-700">Files:</div>
          <div className="flex flex-row gap-4">
            {project?.files.map((file: any, index: number) => (
              <Badge key={index}>{file.file_name}</Badge>
            ))}
          </div>
        </div>
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
              projectId={project.id}
            />
          </div>
        </div>
      )}
      <div className="mt-8">
        {classes.map((classItem: any, index: number) => (
          <ClassCard key={index} classItem={classItem} />
        ))}
      </div>
    </div>
  );
};

export default Page;
