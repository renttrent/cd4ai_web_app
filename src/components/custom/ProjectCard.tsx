import React from "react";
import { AiFillFolderOpen } from "react-icons/ai";

interface ProjectCardProps {
  project: {
    name: string;
    description: string;
    files: File[];
  };
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  if (!project || !project.name || !project.description || !project.files) {
    // Handle : project or its properties are undefined
    return null;
  }

  return (
    <div className="p-4 border rounded-sm bg-indigo-50">
      <div className="font-medium text-sm text-indigo-400">Project</div>
      <div className="font-bold text-lg">{project.name}</div>
      <div className="text-lg">Subtitle</div>
      <div className="text-sm text-gray-500">{project.description}</div>
      <div className="mt-4 flex flex-col gap-2 w-full">
        {project.files.map((file, index) => (
          <button
            key={index}
            className={`${
              index % 2 === 0 ? "bg-indigo-200" : "bg-indigo-100"
            } px-2 hover:bg-indigo-500 rounded-xs hover:text-white`}
          >
            <div className="flex gap-2 items-center w-full">
              <AiFillFolderOpen />
              <span> {file.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;
