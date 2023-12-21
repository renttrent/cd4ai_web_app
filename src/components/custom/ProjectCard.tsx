import { Project } from "@/types/types";
import Link from "next/link";
import React from "react";
import { AiFillFolderOpen } from "react-icons/ai";
import { FileBadge } from "./FileBadge";
import { Card } from "../ui/card";
import { Clipboard, Paperclip } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProject , deleteProject} from "@/util/projects/projects";
import { ConfirmPopover } from "./ConfirmPopover";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { UpdateProjectButton } from "./UpdateProjectModal";

interface ProjectCardProps {
  project: Project;
  onDeletePress?: () => void;
  onEditPress?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDeletePress, onEditPress }) => {
  if (!project || !project.name || !project.description || !project.files) {
    // Handle : project or its properties are undefined
    return null;
  }

  return (
    <Card className="flex flex-col gap-1 p-4 hover:bg-gray-50">
      <div className="font-medium text-sm text-primary">Project <span className="font-bold text-sm">({project.lang.toUpperCase()})</span></div>
      <div className="flex justify-between items-center">
        <Link href={`/project/${project.id}`} key={project.id}>
          <div className="font-bold text-md">{project.name}</div>
        </Link>
        <div className="flex gap-1 items-center">
          <ConfirmPopover
            variant="destructive"
            title="Are you sure?"
            description="Deleting a project will also delete all classes and tasks associated with it"
            onConfirm={onDeletePress}
          >
            <Button variant="destructive" size="sm">
              <Trash size={14} />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </ConfirmPopover>
          <div className="hidden sm:flex gap-1">
            <UpdateProjectButton project={project} />
          </div>
        </div>
      </div>
      <div className="flex gap-0.5 items-center">
            <Paperclip size="10px" />
            <div>
              {project.files.length > 1 ? project.files.length + " files" : project.files.length > 0 ? "1 file" : null}
            </div>
      </div>
      <div className="text-sm text-gray-500 line-clamp-3 text-ellipsis">
        {project.description}
      </div>
    </Card>
  );
};

export default ProjectCard;
