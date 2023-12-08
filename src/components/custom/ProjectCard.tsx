import { Project } from "@/types/types";
import React from "react";
import { AiFillFolderOpen } from "react-icons/ai";
import { FileBadge } from "./FileBadge";
import { Card } from "../ui/card";
import { Clipboard, Paperclip } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  if (!project || !project.name || !project.description || !project.files) {
    // Handle : project or its properties are undefined
    return null;
  }

  return (
    <Card className="flex flex-col gap-1 p-4 hover:bg-gray-50">
      <div className="font-medium text-sm text-primary">Project</div>
      <div className="flex justify-between">
        <div className="font-bold text-md">{project.name}</div>
        <div className="text-sm opacity-70">
          <div className="flex gap-0.5 items-center">
            <Paperclip size="10px" />
            <div>
              {project.files.length
                ? project.files.length == 1
                  ? "1 file"
                  : `{project.files.length} files`
                : null}
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500 line-clamp-3 text-ellipsis">
        {project.description} Lorem ipsum, dolor sit amet consectetur
        adipisicing elit. Atque, numquam a facere minima quisquam possimus
        corrupti, rem accusamus reprehenderit, pariatur placeat quasi
        consequuntur. Porro, molestias! Id unde dignissimos incidunt
        reprehenderit?
      </div>
    </Card>
  );
};

export default ProjectCard;
