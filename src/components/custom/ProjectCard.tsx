import { Project } from "@/types/types";
import React from "react";
import { AiFillFolderOpen } from "react-icons/ai";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  if (!project || !project.name || !project.description || !project.files) {
    // Handle : project or its properties are undefined
    return null;
  }

  return (
    <div className="p-4 border rounded-sm bg-gray-50">
      <div className="font-medium text-sm text-violet-500">Project</div>
      <div className="font-bold text-lg">{project.name}</div>
      <div className="text-lg">Subtitle</div>
      <div className="text-sm text-gray-500">{project.description}</div>
      <div className="mt-4 flex flex-col gap-2 w-full">
        {project.files.map((file, index) => (
          <button
            key={index}
            className={`${
              index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"
            } px-2 hover:bg-indigo-500 rounded-xs hover:text-white`}
          >
            <div className="flex gap-2 items-center w-full">
              <AiFillFolderOpen />
              <span> {file.file_name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;
